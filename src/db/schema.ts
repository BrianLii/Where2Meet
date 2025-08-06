import type { AdapterAccount } from "@auth/core/adapters";
import {
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  uuid,
  unique,
  serial,
  index,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  displayName: text("display_name").default("Default Name"),
  gender: genderEnum("gender").default("other"),
  intro: text("intro"),
  height: integer("height").default(0),
  weight: integer("weight").default(0),
  age: integer("age").default(0),
});

export const userLikesTable = pgTable(
  "user_likes",
  {
    id: serial("id").primaryKey(),
    likerId: text("liker_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    likedId: text("liked_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: doublePrecision("rating"),
  },
  (table) => ({
    likerIdIndex: index("liker_id_index").on(table.likerId),
    likedIdIndex: index("liked_id_index").on(table.likedId),
    uniqCombination: unique().on(table.likerId, table.likedId),
  }),
);

export const userDislikesTable = pgTable(
  "user_dislikes",
  {
    id: serial("id").primaryKey(),
    dislikerId: text("disliker_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    dislikedId: text("disliked_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    dislikerIdIndex: index("disliker_id_index").on(table.dislikerId),
    dislikedIdIndex: index("disliked_id_index").on(table.dislikedId),
    uniqCombination: unique().on(table.dislikerId, table.dislikedId),
  }),
);

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

export const chats = pgTable(
  "chatrooms",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId1: text("user_id1")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    userId2: text("user_id2")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (table) => ({
    uniqCombination: unique().on(table.userId1, table.userId2),
  }),
);

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  senderId: text("sender_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventTypeEnum = pgEnum("eventType", ["public", "private"]);

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: eventTypeEnum("type"),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  label: text("label"),
  positionLat: doublePrecision("positionLat").notNull(),
  positionLng: doublePrecision("positionLng").notNull(),
});

export const participationsTable = pgTable(
  "participations",
  {
    id: serial("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    eventId: integer("eventId")
      .notNull()
      .references(() => eventsTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userIdIndex: index("user_id_index").on(table.userId),
    eventIdIndex: index("event_id_index").on(table.eventId),
    uniqCombination: unique().on(table.userId, table.eventId),
  }),
);

export const eventRepliesTable = pgTable("eventReplies", {
  id: serial("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  eventId: integer("eventId")
    .notNull()
    .references(() => eventsTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
});
