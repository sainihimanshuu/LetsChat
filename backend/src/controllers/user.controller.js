import { z } from "zod";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { db } from "../../index.js";
import bcrypt from "bcrypt";
import { userSocketIdMap } from "../socket/socket.js";
import { users, messages } from "../models/models.js";
import { and, eq, ne } from "drizzle-orm/expressions";
//import { sql } from "drizzle-orm";

const generateTokens = async (user) => {
    try {
        const accessToken = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            process.env.JWT_ACCESSTOKEN_SECRET,
            {
                expiresIn: process.env.JWT_ACCESSTOKEN_EXPIRY,
            }
        );
        const refreshToken = jwt.sign(
            {
                id: user.id,
            },
            process.env.JWT_REFRESHTOKEN_SECRET,
            {
                expiresIn: process.env.JWT_REFRESHTOKEN_EXPIRY,
            }
        );

        await db
            .update(users)
            .set({ refreshToken: refreshToken })
            .where(eq(users.id, user.id));

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "error while generating tokens");
    }
};

const createUserSchema = z.object({
    username: z
        .string()
        .regex(/^[a-zA-Z ]+$/)
        .min(3, { message: "username must be at least 3 character " })
        .max(20, { message: "username can be max 20 character" })
        .trim(),
    email: z.string().email().trim(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" }),
    about: z.string().optional(),
});

const createUser = asyncHandler(async (req, res) => {
    const validatedData = createUserSchema.parse(req.body);

    const isEmail = await db
        .select()
        .from(users)
        .where(eq(users.email, validatedData.email));
    if (isEmail.length > 0) {
        throw new ApiError(400, "user with email already exists");
    }

    const isUsername = await db
        .select()
        .from(users)
        .where(eq(users.username, validatedData.username));
    if (isUsername.length > 0) {
        throw new ApiError(400, "user with username already exists");
    }

    let userDetails = validatedData;
    userDetails.password = await bcrypt.hash(validatedData.password, 10);

    if (req.file) {
        const localFilePath = req.file?.path;
        const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
        const avatar = cloudinaryResponse;

        userDetails = {
            ...userDetails,
            avatarPublicId: avatar.public_id,
            avatarUrl: avatar.url,
        };
    }

    const newUser = await db
        .insert(users)
        .values(userDetails)
        .returning({ id: users.id });
    const user = await db
        .select({
            id: users.id,
            username: users.username,
            email: users.email,
            avatarPublicId: users.avatarPublicId,
            avatarUrl: users.avatarUrl,
            about: users.about,
            createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, newUser[0].id));

    return res
        .status(200)
        .json({ message: "user created successfully", user: user[0] });
});

const loginUserSchema = z.object({
    email: z.string().email().trim(),
    password: z.string(),
});

const loginUser = asyncHandler(async (req, res) => {
    const validatedData = loginUserSchema.parse(req.body);

    const isUser = await db
        .select()
        .from(users)
        .where(eq(users.email, validatedData.email));
    if (isUser.length === 0) {
        throw new ApiError(400, "signup first");
    }

    const userPass = isUser[0].password;

    const isPasswordCorrect = await bcrypt.compare(
        validatedData.password,
        userPass
    );
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Incorrect password");
    }

    const { accessToken, refreshToken } = await generateTokens(isUser[0]);

    const user = await db
        .select({
            id: users.id,
            username: users.username,
            email: users.email,
            avatarPublicId: users.avatarPublicId,
            avatarUrl: users.avatarUrl,
            about: users.about,
            createdAt: users.createdAt,
        })
        .from(users)
        .where(eq(users.id, isUser[0].id));

    const options = {
        httpOnly: true,
        sameSite: "strict",
    };

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json({ message: "login successful", user: user[0], accessToken });
});

const logoutUser = asyncHandler(async (req, res) => {
    await db
        .update(users)
        .set({ refreshToken: null })
        .where(eq(users.id, req.user?.id));

    const options = {
        httpOnly: true,
        sameSite: "strict",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ message: "Logout successful" });
});

const refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
        throw new ApiError(401, "unauthorized access, no refresh token");
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESHTOKEN_SECRET);
    const user = await db.select().from(users).where(eq(users.id, decoded.id));

    if (token != user[0].refreshToken) {
        throw new ApiError(
            401,
            "unaothorized access, refresh token do not match"
        );
    }

    const { accessToken, refreshToken } = await generateTokens(user[0]);

    const options = {
        httpOnly: true,
        sameSite: "strict",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({ message: "tokens refreshed", accessToken: accessToken });
});

const getAllUsers = asyncHandler(async (req, res) => {
    const allUsers = await db
        .select({
            id: users.id,
            username: users.username,
            email: users.email,
            avatarPublicId: users.avatarPublicId,
            avatarUrl: users.avatarUrl,
            about: users.about,
            createdAt: users.createdAt,
        })
        .from(users)
        .where(ne(users.id, req.user.id));

    const updatedUsers = await Promise.all(
        allUsers.map(async (user) => {
            var online = false;
            if (userSocketIdMap[user.id]) {
                online = true;
            }

            const isRead = await db
                .select()
                .from(messages)
                .where(
                    and(
                        eq(messages.sender, user.id),
                        eq(messages.receiver, req.user.id),
                        eq(messages.isRead, false)
                    )
                );

            if (isRead.length === 0) {
                return { ...user, unread: false, online: online };
            }

            return { ...user, unread: true, online: online };
        })
    );

    return res.status(200).json({
        message: "User details for sidebar fetched",
        updatedUsers,
    });
});

export { createUser, loginUser, logoutUser, refreshToken, getAllUsers };
