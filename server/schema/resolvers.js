import User from "../models/Users.js";
import Availability from "../models/Availability.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const resolvers = {
  Query: {
    availabilities: async () => {
      return await Availability.find({ isActive: true }).populate("user");
    },

    me: async (_, __, { user }) => {
      if (!user) return null;
      return await User.findById(user.id);
    }
  },

  Mutation: {
    register: async (_, { name, email, password, phone }) => {
      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashed,
        phone
      });

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Wrong password");

      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    },

    markAvailable: async (_, { tasks, location }, { user }) => {
      let currentUser = user;
    
      //  if no auth, pick a test user(temproary fix)
      if (!currentUser) {
        const users = await User.find();
        if (!users.length) throw new Error("No users found");
        currentUser = { id: users[0]._id };
      }
    
      return await Availability.create({
        user: currentUser.id,
        tasks,
        location
      });
    },

    markUnavailable: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");

      await Availability.updateMany(
        { user: user.id },
        { isActive: false }
      );

      return true;
    }
  }
};

export default resolvers;