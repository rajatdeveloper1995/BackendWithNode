import { Router } from "express";
import {
  currentUserDetails,
  generateAccessToken,
  loginUser,
  logOutUser,
  registerUser,
  updateAvatar,
  uploadCoverImage,
  userPasswordUpdate,
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

// SECURED ROUTES
router.route("/logout").post(verifyJwt, logOutUser);
router.route("/generate-accessToken").post(generateAccessToken);
router.route("/updatePassword").post(verifyJwt,userPasswordUpdate);
router.route("/user-details").get(verifyJwt,currentUserDetails);
router.route("/update-details").put(verifyJwt,updateUserDetails);
router.route("/update-avatar").put(upload.single({name:"avatar"}),verifyJwt,updateAvatar);
router.route("/update-coverimage").put(upload.single({name:"coverImage"}),verifyJwt,uploadCoverImage);


export { router };
