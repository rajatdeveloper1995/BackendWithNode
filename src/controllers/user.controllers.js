import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrorHandler } from "../utils/ApiErrorHandler.js";
import { uploadImgToCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponseHandler.js";

// GENERATE ACCESS AND REFRESH TOKEN
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiErrorHandler(400, "user not valid");
    }
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new ApiErrorHandler(
        401,
        "unauthorized user, unable to generate tokens"
      );
    }

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiErrorHandler(500, "unable to generate tokens");
  }
};

// REGISTER CONTROLLER
const registerUser = asyncHandler(async (req, res) => {
  // 1. Access the request payload from req
  // 2. Check if firstname,username,email,passoword is not empty (Validation)
  // 3. Check if user already exists in db
  // 3. Check for avatar and coverimage from file system
  // 4. if avatar is not present then return validation error
  // 5. Upload avatar and coverImage to cloudinary
  // 6. create object and insert entry in Db
  // 7. after creating return response to user by removing password, refresh token from response
  // 8. return response
  const { username, email, fullName, password } = req.body;

  // Validation check for required fields
  const isFieldValidationCheck = [username, email, fullName, password].some(
    (field) => field?.trim() === ""
  );
  if (isFieldValidationCheck) {
    throw new ApiErrorHandler(400, "Required field should not be empty");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiErrorHandler(409, "username or passowrd is already existed");
  }

  // Check for Avatar and CoverImage
  const avatarImageCheck = req.files?.avatar?.[0]?.path;
  const coverImageCheck = req.files?.coverImage?.[0]?.path;

  if (!avatarImageCheck) {
    throw new ApiErrorHandler(400, "Avatar field is required");
  }

  // Upload Avatar to Clodinary
  const avatarUploadResponse = await uploadImgToCloudinary(avatarImageCheck);
  const coverImageUploadResponse = await uploadImgToCloudinary(coverImageCheck);

  // Validate to check Avatar successfully uploaded
  if (!avatarUploadResponse?.url) {
    throw new ApiErrorHandler(500, "Unable to upload Avatar on server");
  }

  // Insert Entry Into db
  const user = await User.create({
    username,
    email,
    fullName,
    password,
    avatar: avatarUploadResponse.url,
    coverImage: coverImageUploadResponse?.url || "",
  });

  // REMOVING SENSATIVE INFORMATION FROM RESPONSE
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // RETURN RESPONSE TO USER
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Successfully Registered"));
});

// LOGIN CONTROLLER
const loginUser = asyncHandler(async (req, res) => {
  // 1. Get the payload from user in req.body
  // 2. Check username and email is not empty
  // 3. Check username or email is present in db
  // 4. Compare user password and db password
  // 5. If password matched then generate access token and refresh token
  // 6. Update db with refresh token value
  // 7. Now as we get access token and refresh token, set cookies and return result to user.

  const { username, email, password } = req.body;

  // VALIDATE USERNAME OR EMAIL IS NOT EMPTY
  if (!username && !email) {
    throw new ApiErrorHandler(401, "username or email is required");
  }

  // CHECK USERNAME OR EMAIL MATCHES WITH ANY RECORDS
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiErrorHandler(409, "user not valid, please register the user");
  }

  // IF USER PRESENT THEN CHECK PASSWORD
  const isValidPassword = await user.isPasswordCheck(password);

  if (!isValidPassword) {
    throw new ApiErrorHandler(
      400,
      "Password invalid,please verify and enter correct password"
    );
  }

  // IF PASSWORD VALID THEN GENERATE ACCESS TOKEN AND REFRESH TOKEN

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // COOKIE OPTION SETTING
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "user loggedIn successfully", loggInUser));
});

// Logout User
const logOutUser = asyncHandler(async (req, res) => {
  // First I need to find a way where i will get user details here,
  // for this I need to inject my middleware where in req i will instert user details and will consume here.

  const userId = req?.user?._id;
  console.log("userId12345",userId)
  if (!userId) {
    throw new ApiErrorHandler(500, "unable to logout");
  }

  await User.findByIdAndUpdate(userId, { refreshToken: undefined });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,"successfully logout"));
});

export { registerUser, loginUser,logOutUser };
