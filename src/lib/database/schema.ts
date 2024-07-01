import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id", {
    length: 128, 
  }).primaryKey(),
  name: text("name", {
    length: 255,
  }),
  email: text("email", {
    length: 255,
  }).unique().notNull(),
  hashedPassword: text("hashed_password", {
    length: 255,
  }),
  isVerified: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at").notNull(),
});

export const verificationToken = sqliteTable("verification_token", {
  token: text("token", {
    length: 255, 
  }).notNull().unique().primaryKey(),
  userId: text("user_id").references(() => user.id, {onDelete: 'cascade'}).notNull(),  
  type: text("type", {
    enum: ["resetPass", "signUpVerify" , "newPassword"], 
  }).notNull(),
  createdAt: integer("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  expiresAt: integer("expires_at").notNull(), 
});


export const session = sqliteTable("session", {
  id: text("id", {
    length: 128,
  }).primaryKey(),
  email: text("email", {
    length: 255,
  }),
  name: text("name", {
    length: 255,
  }),
  userId: text("user_id", {
    length: 50,
  }).notNull()
    .references(() => user.id),
    expires_at: integer("expires_at").notNull(),
});
