import asyncHandler from "../utils/asyncHandler.js";
import { db } from "../../index.js";
import { ApiError } from "../utils/ApiError.js";
import { io, getReceiverSocketId } from "../socket/socket.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { messages } from "../models/models.js";
import { and, eq } from "drizzle-orm/expressions";
import { sql } from "drizzle-orm";

const sendMessage = asyncHandler(async (req, res) => {
    const senderId = req.user.id;
    const { receiverId } = req.params;
    const { message } = req.body;
    var newMessage;

    if (req.file) {
        const localFilePath = req.file?.path;
        const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
        const image = cloudinaryResponse;

        newMessage = await db.insert(messages).values({
            sender: senderId,
            receiver: receiverId,
            isRead: false,
            content: image.url,
        });
    }

    if (message) {
        newMessage = await db.insert(messages).values({
            sender: senderId,
            receiver: receiverId,
            isRead: false,
            content: message,
        });
    }

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("chat message", newMessage);
    } else {
        throw new ApiError(500, "no receiverSocketId");
    }

    return res
        .status(200)
        .json({ message: "message sent", newMessage: newMessage[0] });
});

const getMessages = asyncHandler(async (req, res) => {
    const { receiverId } = req.params;
    const senderId = req.user.id;

    const messages = await db
        .select()
        .from(messages)
        .where(
            and(
                eq(messages.sender, senderId),
                eq(messages.receiver, receiverId)
            )
        );

    return res
        .status(200)
        .json({ message: "messages fetched successfully", messages });
});

const markAsRead = asyncHandler(async (req, res) => {
    const receiverId = req.user.id;
    const { messageId } = req.params;

    await db
        .update(messages)
        .set({ isRead: true })
        .where(
            and(eq(messages.id, messageId), eq(messages.receiver, receiverId))
        );

    return res.status(200).json({ message: "marked as read" });
});

export { sendMessage, getMessages, markAsRead };
