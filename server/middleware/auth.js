import jwt from "jsonwebtoken";

export const getUserFromToken = (req) => {
const token = req.headers.authorization || "";

if(!token) return null;

try{
    return jwt.verify(tooken, process.env.JWT_SECRET);
}catch(err){
    return null;
}
}
    