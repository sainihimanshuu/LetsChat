import { Router } from "express";
import verifyJwt from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

import {
    sendMessage,
    getMessages,
    markAsRead,
} from "../controllers/message.controller.js";

router
    .route("/sendMessage/:receiverId")
    .post(verifyJwt, upload.single("image"), sendMessage);
router.route("/getMessages/:receiverId").get(verifyJwt, getMessages);
router.route("/markAsRead/:messageId").post(verifyJwt, markAsRead);

export default router;
