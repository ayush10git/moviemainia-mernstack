import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

//registering the user
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  // console.log("Email: ", email);

  if (
    [email, username, password, confirmPassword].some((field) => {
      return field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password do not match");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  const user = await User.create({
    avatar: avatar.url,
    email,
    password,
    username: username,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -confirmPassword -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully!"));
});

//logging in the user
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User successfully loggedin")
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    secure: true,
    httpOnly: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, req.user, "user logged out successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(400, "User ID is not available");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  await User.deleteOne({ _id: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

const addToWatchlist = asyncHandler(async (req, res) => {
  const { imdbID } = req.body;
  const userId = req.user._id;

  if (!imdbID) throw new ApiError(400, "provide imdb id");

  const user = await User.findById(userId);

  if (!user) throw new ApiError(401, "Invalid user id");

  if (!user.watchlist.includes(imdbID)) {
    await user.updateOne({ $push: { watchlist: imdbID } }, { new: true });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.watchlist, "watchlist updated successfully")
    );
});

const removeFromWatchlist = asyncHandler(async (req, res) => {
  const { imdbID } = req.body;
  const userId = req.user._id;

  if (!imdbID) {
    throw new ApiError(400, "IMDb ID is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(401, "Invalid user ID");
  }

  // Check if the IMDb ID exists in the watchlist array
  const index = user.watchlist.indexOf(imdbID);
  if (index === -1) {
    return res.status(404).json(new ApiResponse(404, null, "IMDb ID not found in watchlist"));
  }

  // Remove the IMDb ID from the watchlist array
  user.watchlist.splice(index, 1);

  // Save the updated user object
  await user.save();

  return res.status(200).json(new ApiResponse(200, user.watchlist, "IMDb ID removed from watchlist"));
});


const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password -refreshToken");

  if (!user) throw new ApiError(400, "Invalid user id");

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "user fetched successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token has expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200, { accessToken, newRefreshToken }),
        "Access token refreshed"
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});

export { registerUser, loginUser, logoutUser, deleteUser, addToWatchlist, getCurrentUser, refreshAccessToken, removeFromWatchlist };
