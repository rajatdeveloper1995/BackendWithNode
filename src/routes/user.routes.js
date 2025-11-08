import { Router } from "express";
import {
  loginUser,
  logOutUser,
  registerUser,
} from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/verifyJwt.middleware.js";

const router = Router();

const cpUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);
router.route("/register").post(cpUpload, registerUser);

// LOGGEDIN USER
router.route("/login").post(loginUser);

//LOGOUT USER
router.route("/logout").post(verifyJwt, logOutUser);

export { router };
