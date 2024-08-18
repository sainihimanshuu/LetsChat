import {
    pgTable,
    integer,
    serial,
    text,
    timestamp,
    boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username", { length: 255 }).notNull().default(""),
    email: text("email", { length: 255 }).notNull().unique(),
    avatarPublicId: text("avatar_public_id").default(null),
    avatarUrl: text("avatar_url").default(null),
    password: text("password").notNull(),
    refreshToken: text("refresh_token").default(null),
    about: text("about").default(null),
    createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    content: text("content"),
    sender: integer("sender_id").references(() => users.id),
    receiver: integer("receiver_id").references(() => users.id),
    isRead: boolean("isRead").default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
