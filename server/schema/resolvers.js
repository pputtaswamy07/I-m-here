import User from "../models/Users.js";
import Availability from "../models/Availability.js";
import HelpRequest from "../models/HelpRequest.js";
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
    },

    myRequests: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await HelpRequest.find({ seeker: user.id }).populate("seeker");
    },

    openRequests: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await HelpRequest.find({ status: "OPEN" }).populate("seeker");
    },
  },

  Mutation: {
    register: async (_, args) => {

      const {
        name,
        email,
        password,
        phone,
        location,
        role
      } = args;
    
      // check existing user
      const existingUser = await User.findOne({ email });
    
      if (existingUser) {
        throw new Error("User already exists");
      }
    
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);
    
      // create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        location,
        role
      });
    
      // create token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      return token;
    },

    login: async (_, { email, password }) => {

      // find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
    
      // compare password
      const validPassword = await bcrypt.compare(
        password,
        user.password
      );
    
      if (!validPassword) {
        throw new Error("Invalid password");
      }
    
      // create JWT token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
    
      return token;
    },

   markAvailable: async (_, { tasks, location }, { user }) => {
  // user must be logged in
  if (!user) {
    throw new Error("Not authenticated");
  }
  return await Availability.create({
    user: user.id,
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
    },

    postRequest: async (_, { title, description, category, location }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const seeker = await User.findById(user.id);
      if (!seeker || seeker.role !== "SEEKER") {
        throw new Error("Only seekers can post requests");
      }

      return await HelpRequest.create({
        seeker: user.id,
        title,
        description,
        category,
        location,
      });
    },

    cancelRequest: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const request = await HelpRequest.findById(id);
      if (!request) throw new Error("Request not found");
      if (String(request.seeker) !== String(user.id)) {
        throw new Error("Not your request");
      }

      request.status = "CANCELLED";
      await request.save();
      return request;
    },
  },
};

export default resolvers;