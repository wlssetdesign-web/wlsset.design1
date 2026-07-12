import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const mediaItemSchema = z.object({
  url: z.string(),
  type: z.enum(["image", "video"]),
  sortOrder: z.number().default(0),
});

export type MediaItem = z.infer<typeof mediaItemSchema>;

export const portfolioItems = pgTable("portfolio_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  description: text("description").notNull(),
  tags: text("tags"),
  projectLink: text("project_link"),
  isFullPage: boolean("is_full_page").default(false),
  showImageOnHover: boolean("show_image_on_hover").default(true),
  sortOrder: integer("sort_order").default(0),
  media: jsonb("media").default([]).$type<MediaItem[]>(),
  blocks: jsonb("blocks").default([]).$type<ProjectBlock[]>(),
});

export const insertPortfolioSchema = createInsertSchema(portfolioItems).omit({
  id: true,
});

export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  itemsEn: text("items_en").notNull(),
  itemsAr: text("items_ar").notNull(),
  icon: text("icon").notNull(),
  sortOrder: integer("sort_order").default(0),
  productOptions: text("product_options"),
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export const aboutSections = pgTable("about_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sectionKey: text("section_key").notNull().unique(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  textEn: text("text_en").notNull(),
  textAr: text("text_ar").notNull(),
  image: text("image"),
  sortOrder: integer("sort_order").default(0),
});

export const insertAboutSectionSchema = createInsertSchema(aboutSections).omit({
  id: true,
});

export type InsertAboutSection = z.infer<typeof insertAboutSectionSchema>;
export type AboutSection = typeof aboutSections.$inferSelect;

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  customerEmail: text("customer_email"),
  channel: text("channel").notNull(),
  items: jsonb("items").notNull().$type<OrderItemData[]>(),
  createdAt: text("created_at").notNull(),
});

export const orderItemSchema = z.object({
  title: z.string(),
  requiredProduct: z.string(),
  preferredColors: z.string(),
  fontStyle: z.string(),
  designNotes: z.string(),
});

export type OrderItemData = z.infer<typeof orderItemSchema>;

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const contactInfo = pgTable("contact_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  sortOrder: integer("sort_order").default(0),
});

export const insertContactInfoSchema = createInsertSchema(contactInfo).omit({
  id: true,
});

export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type ContactInfoItem = typeof contactInfo.$inferSelect;

// Project Blocks for Behance-style case studies
export const projectBlockSchema = z.object({
  id: z.string(),
  type: z.enum(["full_image", "two_column_images", "video", "text_block", "divider"]),
  sortOrder: z.number(),
  content: z.record(z.any()),
});

export type ProjectBlock = z.infer<typeof projectBlockSchema>;
