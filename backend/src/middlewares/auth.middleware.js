import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { db } from "../../index.js";
import { users } from "../models/models.js";
import { eq } from "drizzle-orm/expressions";

const verifyJwt = asyncHandler(async (req, _, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "unauthorized access, no access token");
    }
    try {
        var decoded = jwt.verify(token, process.env.JWT_ACCESSTOKEN_SECRET);
    } catch (error) {
        throw new ApiError(500, "error while decoding access token");
    }

    const user = await db
        .select({
            id: users.id,
            username: users.username,
            email: users.email,
            avatarPublicId: users.avatarPublicId,
            avatarUrl: users.avatarUrl,
            about: users.about,
        })
        .from(users)
        .where(eq(users.id, decoded.id));

    if (!user) {
        throw new ApiError(403, "Invalid token");
    }

    req.user = user[0];

    next();
});

export default verifyJwt;
