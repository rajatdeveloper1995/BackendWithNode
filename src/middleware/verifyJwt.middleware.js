import { ApiErrorHandler } from "../utils/ApiErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJwt = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies?.accessToken || req.header("Authorization").replace("Bearer ", "")

  if (!accessToken) {
    throw new ApiErrorHandler(401, "Unauthorized user");
  }

  const jwtPayload = await jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );

  const user = await User.findById(jwtPayload._id);

  if (!user) {
    throw new ApiErrorHandler(401, "Unauthorized user");
  }

  req.user = user;
  next();
});

export { verifyJwt };
