import {
    loginUser,
    createUser,
    logoutUser,
    refreshToken,
    getAllUsers,
} from "../controllers/user.controller.js";
import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/loginUser").post(loginUser);
router.route("/createUser").post(upload.single("avatar"), createUser);
router.route("/logoutUser").post(verifyJwt, logoutUser);
router.route("/refreshTokens").get(refreshToken);
router.route("/getAllUsers").get(verifyJwt, getAllUsers);

export default router;
