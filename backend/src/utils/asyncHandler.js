import { ZodError } from "zod";

const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next);
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: error.errors });
        } else {
            return res.status(error.statusCode || 500).json({
                message: error.message || "Internal server error",
                error: error,
            });
        }
    }
};

export default asyncHandler;
