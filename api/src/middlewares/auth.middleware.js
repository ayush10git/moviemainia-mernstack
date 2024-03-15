import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    let token;

    // Check if the token is in the cookies
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    // Check if the token is in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) throw new ApiError(401, "Unauthorized request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decodedToken);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) throw new ApiError(401, "Invalid Access Token");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});