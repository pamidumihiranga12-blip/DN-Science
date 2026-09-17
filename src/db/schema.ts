import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", ["student", "admin"]);
export const userStatusEnum = pgEnum("user_status", ["active", "suspended", "pending"]);
export const enrollmentStatusEnum = pgEnum("enrollment_status", ["pending", "active", "rejected"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "confirmed", "shipped", "delivered", "cancelled"]);
export const courseLevelEnum = pgEnum("course_level", ["OL", "AL", "Both"]);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  phone: varchar("phone", { length: 20 }),
  school: varchar("school", { length: 255 }),
  grade: varchar("grade", { length: 50 }),
  role: userRoleEnum("role").notNull().default("student"),
  status: userStatusEnum("status").notNull().default("active"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  level: courseLevelEnum("level").notNull().default("OL"),
  subject: varchar("subject", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  thumbnail: text("thumbnail"),
  isPublished: boolean("is_published").notNull().default(true),
  totalVideos: integer("total_videos").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Videos table
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  youtubeUrl: text("youtube_url"),
  duration: varchar("duration", { length: 20 }),
  orderIndex: integer("order_index").notNull().default(0),
  isFree: boolean("is_free").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Books table
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  level: courseLevelEnum("level").notNull().default("OL"),
  subject: varchar("subject", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  thumbnail: text("thumbnail"),
  stock: integer("stock").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Enrollments table
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  status: enrollmentStatusEnum("status").notNull().default("pending"),
  paymentProof: text("payment_proof"),
  notes: text("notes"),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Student video access (manual override by admin)
export const studentVideoAccess = pgTable("student_video_access", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  videoId: integer("video_id").notNull().references(() => videos.id, { onDelete: "cascade" }),
  grantedByAdmin: boolean("granted_by_admin").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Book orders table
export const bookOrders = pgTable("book_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookId: integer("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  shippingAddress: text("shipping_address"),
  phone: varchar("phone", { length: 20 }),
  notes: text("notes"),
  orderedAt: timestamp("ordered_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Testimonials table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  school: varchar("school", { length: 255 }),
  grade: varchar("grade", { length: 50 }),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  avatar: text("avatar"),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
