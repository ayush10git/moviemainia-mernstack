import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { addToWatchlist, deleteUser, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, removeFromWatchlist,} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/delete").post(verifyJWT, deleteUser);

router.route("/addToWatchlist").post(verifyJWT, addToWatchlist);
router.route("/removeFromWatchlist").post(verifyJWT, removeFromWatchlist);

router.route("/getUser").get(verifyJWT, getCurrentUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
