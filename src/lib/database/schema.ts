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
  })
    .notNull()
    .references(() => user.id),
    expires_at: integer("expires_at").notNull(),
});
