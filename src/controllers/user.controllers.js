import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrorHandler } from "../utils/ApiErrorHandler.js";
import { uploadImgToCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponseHandler.js";

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
   throw new ApiErrorHandler(
      409,
      "username or passowrd is already existed",
    );
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

export { registerUser };
