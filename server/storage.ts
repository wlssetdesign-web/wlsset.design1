import {
  type User, type InsertUser,
  type PortfolioItem, type InsertPortfolio,
  type Service, type InsertService,
  type AboutSection, type InsertAboutSection,
  type ContactInfoItem, type InsertContactInfo,
  type MediaItem, type ProjectBlock,
  type Order, type InsertOrder,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/node-postgres";
import { users, portfolioItems, services, aboutSections, contactInfo, orders } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Users / Auth
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Portfolio
  getPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItem(id: string): Promise<PortfolioItem | undefined>;
  getPortfolioItemsByTag(tag: string): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolio): Promise<PortfolioItem>;
  updatePortfolioItem(id: string, item: Partial<InsertPortfolio>): Promise<PortfolioItem | undefined>;
  deletePortfolioItem(id: string): Promise<boolean>;
  updatePortfolioBlocks(id: string, blocks: ProjectBlock[]): Promise<PortfolioItem | undefined>;

  // Services
  getServices(): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;

  // About Sections
  getAboutSections(): Promise<AboutSection[]>;
  getAboutSection(id: string): Promise<AboutSection | undefined>;
  createAboutSection(section: InsertAboutSection): Promise<AboutSection>;
  updateAboutSection(id: string, section: Partial<InsertAboutSection>): Promise<AboutSection | undefined>;
  deleteAboutSection(id: string): Promise<boolean>;

  // Contact Info
  getContactInfo(): Promise<ContactInfoItem[]>;
  getContactInfoItem(id: string): Promise<ContactInfoItem | undefined>;
  createContactInfoItem(item: InsertContactInfo): Promise<ContactInfoItem>;
  updateContactInfoItem(id: string, item: Partial<InsertContactInfo>): Promise<ContactInfoItem | undefined>;
  deleteContactInfoItem(id: string): Promise<boolean>;

  // Orders
  getOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private portfolio: Map<string, PortfolioItem>;
  private servicesMap: Map<string, Service>;
  private about: Map<string, AboutSection>;
  private contact: Map<string, ContactInfoItem>;
  private ordersMap: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.portfolio = new Map();
    this.servicesMap = new Map();
    this.about = new Map();
    this.contact = new Map();
    this.ordersMap = new Map();
    this.seedData();
  }

  private seedData() {
    const now = new Date().toISOString();

    // Seed services
    const defaultServices: InsertService[] = [
      { key: "brandIdentity", titleEn: "Brand Identity Design", titleAr: "تصميم الهوية البصرية", itemsEn: "Logo Design, Complete Identity, Brand Guidelines, Color & Typography, Rebranding", itemsAr: "تصميم الشعار، الهوية الكاملة، إرشادات العلامة التجارية، الألوان والطباعة، إعادة العلامة التجارية", icon: "Palette", sortOrder: 1, productOptions: "Logo Design, Brand Guidelines, Color Palette, Typography System, Rebranding" },
      { key: "printDesign", titleEn: "Print Design", titleAr: "تصميم المطبوعات", itemsEn: "Business Cards, Brochures & Flyers, Posters, Roll-Up Banners, Menus, Letterheads, Packaging", itemsAr: "بطاقات العمل، الكتيبات والمنشورات، الملصقات، لافتات الرول آب، القوائم، رؤوس الرسائل، التغليف", icon: "Printer", sortOrder: 2, productOptions: "Business Cards, Brochures, Posters, Menus, Flyers, Roll-Up Banners, Packaging" },
      { key: "socialMedia", titleEn: "Social Media Design", titleAr: "تصميم وسائل التواصل", itemsEn: "Instagram Posts/Stories, Facebook Covers, Ad Creatives, Grid Layouts", itemsAr: "منشورات/قصص إنستجرام، أغلفة فيسبوك، الإعلانات الإبداعية، تخطيطات الشبكة", icon: "Share2", sortOrder: 3, productOptions: "Instagram Posts, Instagram Stories, Facebook Covers, Ad Creatives, Content Grids" },
      { key: "imageEditing", titleEn: "Image Editing", titleAr: "تحرير الصور", itemsEn: "High-End Retouching, Background Removal, Color Correction, Compositing", itemsAr: "إعادة اللمس العالية، إزالة الخلفية، تصحيح الألوان، المركبات", icon: "Image", sortOrder: 4, productOptions: "Retouching, Background Removal, Color Correction, Compositing" },
      { key: "vectorTracing", titleEn: "Vector Tracing", titleAr: "تتبع المتجهات", itemsEn: "Logo Vectorization, Sketch to Vector, High-Res Scaling", itemsAr: "متجه الشعار، من الرسم إلى المتجه، القياس عالي الدقة", icon: "PenTool", sortOrder: 5, productOptions: "Logo Vectorization, Sketch to Vector, High-Resolution Scaling" },
      { key: "infographic", titleEn: "Infographic Design", titleAr: "تصميم الرسوم البيانية", itemsEn: "Data Visualization, Process Flowcharts, Educational Graphics", itemsAr: "تصور البيانات، مخططات العمليات، الرسومات التعليمية", icon: "BarChart", sortOrder: 6, productOptions: "Data Visualization, Process Flowcharts, Educational Graphics" },
      { key: "video", titleEn: "Video & Motion", titleAr: "الفيديو والحركة", itemsEn: "Video Editing, VFX, Intro/Outro, Social Media Video, Motion Graphics", itemsAr: "تحرير الفيديو، المؤثرات البصرية، المقدمات والنهايات، فيديو وسائل التواصل، الرسوميات المتحركة", icon: "Video", sortOrder: 7, productOptions: "Video Editing, Intro/Outro, Social Media Video, Motion Graphics, VFX" },
    ];

    for (const s of defaultServices) {
      const id = randomUUID();
      this.servicesMap.set(id, { ...s, id, sortOrder: s.sortOrder ?? 0, productOptions: s.productOptions ?? null });
    }

    // Seed about sections
    const defaultAbout: InsertAboutSection[] = [
      { sectionKey: "heading", titleEn: "WLSSET Design – Where Ideas Happen", titleAr: "WLSSET Design فكرة تتحقق", textEn: "Transforming your vision into unique, high-impact designs.", textAr: "نحوّل أفكارك لتصاميم واقعية تميزك.", sortOrder: 1 },
      { sectionKey: "aboutUs", titleEn: "About Us", titleAr: "من نحن", textEn: "At WLSSET Design, we believe every idea deserves its moment in the spotlight. What started as a simple passion and a bold dream has become our mission: to turn your concepts into authentic designs that speak your language and power your projects.", textAr: "في WLSSET Design نؤمن أن كل فكرة تستحق أن ترى النور. بدأنا من شغف بسيط وحلم كبير، وهدفنا ان نحول أي فكرة إلى تصميم حقيقي يعبّر عنك ويخدم مشروعك.", sortOrder: 2 },
      { sectionKey: "story", titleEn: "Our Story", titleAr: "قصتنا", textEn: "WLSSET is more than just a name; it represents the start of a journey and a path that never ends. It's a reflection of our daily hustle and our drive to evolve. We don't just design; we bridge the gap between imagination and reality.", textAr: "اسم WLSSET يعبر عن البداية، عن الطريق المستمر. هو انعكاس لرحلتنا اليومية، وسعينا الدائم نحو التطور والوصول. ومن خلال عملنا، نحول الأفكار من مجرد تصور… إلى واقع ملموس.", sortOrder: 3 },
      { sectionKey: "whatWeDo", titleEn: "What We Do", titleAr: "ماذا نقدم", textEn: "Logo Design, Brand Identity, Social Media Content, Creative Print Media", textAr: "تصميم الشعار، الهوية البصرية، محتوى وسائل التواصل، المطبوعات الإبداعية", sortOrder: 4 },
      { sectionKey: "goal", titleEn: "Our Goal", titleAr: "هدفنا", textEn: "We aim to be your partners in success. We're here to help you turn your 'what if' into a 'what's next,' creating projects that capture attention and leave a lasting legacy.", textAr: "هدفنا ان نكون شركاء في نجاحك، و نساعدك في تحويل فكرتك إلى مشروع حقيقي يلفت الانتباه ويترك أثر كبير.", sortOrder: 5 },
      { sectionKey: "closing", titleEn: "Closing", titleAr: "الخاتمة", textEn: "WLSSET Design – An Idea Realized. Launch your idea today… and let it reach its destination.", textAr: "ولصت ديزاين – فكرة تتحقق. ابدأ فكرتك اليوم… وخليها توصل.", sortOrder: 6 },
    ];

    for (const a of defaultAbout) {
      const id = randomUUID();
      this.about.set(id, { ...a, id, image: null, sortOrder: a.sortOrder ?? 0 });
    }
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Portfolio
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return Array.from(this.portfolio.values());
  }

  async getPortfolioItem(id: string): Promise<PortfolioItem | undefined> {
    return this.portfolio.get(id);
  }

  async getPortfolioItemsByTag(tag: string): Promise<PortfolioItem[]> {
    const searchTag = tag.toLowerCase().trim();
    return Array.from(this.portfolio.values()).filter((item) => {
      if (!item.tags) return false;
      const tags = item.tags.split(",").map((t) => t.toLowerCase().trim());
      return tags.includes(searchTag) || tags.some((t) => t.includes(searchTag));
    });
  }

  async createPortfolioItem(item: InsertPortfolio): Promise<PortfolioItem> {
    const id = randomUUID();
    const newItem: PortfolioItem = { ...item, id, sortOrder: item.sortOrder ?? 0, tags: item.tags ?? null, projectLink: item.projectLink ?? null, showImageOnHover: item.showImageOnHover ?? true, isFullPage: item.isFullPage ?? false, media: item.media ?? [], blocks: item.blocks ?? [] };
    this.portfolio.set(id, newItem);
    return newItem;
  }

  async updatePortfolioItem(id: string, item: Partial<InsertPortfolio>): Promise<PortfolioItem | undefined> {
    const existing = this.portfolio.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...item };
    this.portfolio.set(id, updated);
    return updated;
  }

  async deletePortfolioItem(id: string): Promise<boolean> {
    return this.portfolio.delete(id);
  }

  async updatePortfolioBlocks(id: string, blocks: ProjectBlock[]): Promise<PortfolioItem | undefined> {
    const existing = this.portfolio.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, blocks };
    this.portfolio.set(id, updated);
    return updated;
  }

  // Services
  async getServices(): Promise<Service[]> {
    return Array.from(this.servicesMap.values());
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.servicesMap.get(id);
  }

  async createService(service: InsertService): Promise<Service> {
    const id = randomUUID();
    const newService: Service = { ...service, id, sortOrder: service.sortOrder ?? 0, productOptions: service.productOptions ?? null };
    this.servicesMap.set(id, newService);
    return newService;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const existing = this.servicesMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...service };
    this.servicesMap.set(id, updated);
    return updated;
  }

  async deleteService(id: string): Promise<boolean> {
    return this.servicesMap.delete(id);
  }

  // About Sections
  async getAboutSections(): Promise<AboutSection[]> {
    return Array.from(this.about.values());
  }

  async getAboutSection(id: string): Promise<AboutSection | undefined> {
    return this.about.get(id);
  }

  async createAboutSection(section: InsertAboutSection): Promise<AboutSection> {
    const id = randomUUID();
    const newSection: AboutSection = { ...section, id, image: section.image || null, sortOrder: section.sortOrder ?? 0 };
    this.about.set(id, newSection);
    return newSection;
  }

  async updateAboutSection(id: string, section: Partial<InsertAboutSection>): Promise<AboutSection | undefined> {
    const existing = this.about.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...section };
    this.about.set(id, updated);
    return updated;
  }

  async deleteAboutSection(id: string): Promise<boolean> {
    return this.about.delete(id);
  }

  // Contact Info
  async getContactInfo(): Promise<ContactInfoItem[]> {
    return Array.from(this.contact.values());
  }

  async getContactInfoItem(id: string): Promise<ContactInfoItem | undefined> {
    return this.contact.get(id);
  }

  async createContactInfoItem(item: InsertContactInfo): Promise<ContactInfoItem> {
    const id = randomUUID();
    const newItem: ContactInfoItem = { ...item, id, sortOrder: item.sortOrder ?? 0 };
    this.contact.set(id, newItem);
    return newItem;
  }

  async updateContactInfoItem(id: string, item: Partial<InsertContactInfo>): Promise<ContactInfoItem | undefined> {
    const existing = this.contact.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...item };
    this.contact.set(id, updated);
    return updated;
  }

  async deleteContactInfoItem(id: string): Promise<boolean> {
    return this.contact.delete(id);
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.ordersMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createOrder(insert: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const newOrder: Order = {
      id,
      customerName: insert.customerName,
      customerPhone: insert.customerPhone ?? null,
      customerEmail: insert.customerEmail ?? null,
      channel: insert.channel,
      items: insert.items as any,
      createdAt: insert.createdAt,
    };
    this.ordersMap.set(id, newOrder);
    return newOrder;
  }
}

const pgPool = (() => {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not set – falling back to in-memory storage");
    return null;
  }
  const { Pool } = require("pg");
  return new Pool({ connectionString: process.env.DATABASE_URL });
})();

const db = pgPool ? drizzle(pgPool) : null;

export class DatabaseStorage implements IStorage {
  private pool: any;
  private db: any;

  constructor() {
    this.pool = pgPool;
    this.db = db;
  }

  async getUser(id: string): Promise<User | undefined> {
    const rows = await this.db.select().from(users).where(eq(users.id, id));
    return rows[0] as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const rows = await this.db.select().from(users).where(eq(users.username, username));
    return rows[0] as User | undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const rows = await this.db.insert(users).values({ ...user, id }).returning();
    return rows[0] as User;
  }

  async getPortfolioItems(): Promise<PortfolioItem[]> {
    const rows = await this.db.select().from(portfolioItems);
    return rows as PortfolioItem[];
  }

  async getPortfolioItem(id: string): Promise<PortfolioItem | undefined> {
    const rows = await this.db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    return rows[0] as PortfolioItem | undefined;
  }

  async getPortfolioItemsByTag(tag: string): Promise<PortfolioItem[]> {
    const rows = await this.db.select().from(portfolioItems).where(sql`${portfolioItems.tags} ILIKE ${"%" + tag + "%"}`);
    return rows as PortfolioItem[];
  }

  async createPortfolioItem(item: InsertPortfolio): Promise<PortfolioItem> {
    const id = randomUUID();
    const rows = await this.db.insert(portfolioItems).values({ ...item, id }).returning();
    return rows[0] as PortfolioItem;
  }

  async updatePortfolioItem(id: string, item: Partial<InsertPortfolio>): Promise<PortfolioItem | undefined> {
    const rows = await this.db.update(portfolioItems).set(item).where(eq(portfolioItems.id, id)).returning();
    return rows[0] as PortfolioItem | undefined;
  }

  async deletePortfolioItem(id: string): Promise<boolean> {
    const rows = await this.db.delete(portfolioItems).where(eq(portfolioItems.id, id)).returning();
    return rows.length > 0;
  }

  async updatePortfolioBlocks(id: string, blocks: ProjectBlock[]): Promise<PortfolioItem | undefined> {
    const rows = await this.db.update(portfolioItems).set({ blocks: blocks as any }).where(eq(portfolioItems.id, id)).returning();
    return rows[0] as PortfolioItem | undefined;
  }

  async getServices(): Promise<Service[]> {
    const rows = await this.db.select().from(services);
    return rows as Service[];
  }

  async getService(id: string): Promise<Service | undefined> {
    const rows = await this.db.select().from(services).where(eq(services.id, id));
    return rows[0] as Service | undefined;
  }

  async createService(service: InsertService): Promise<Service> {
    const id = randomUUID();
    const rows = await this.db.insert(services).values({ ...service, id }).returning();
    return rows[0] as Service;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service | undefined> {
    const rows = await this.db.update(services).set(service).where(eq(services.id, id)).returning();
    return rows[0] as Service | undefined;
  }

  async deleteService(id: string): Promise<boolean> {
    const rows = await this.db.delete(services).where(eq(services.id, id)).returning();
    return rows.length > 0;
  }

  async getAboutSections(): Promise<AboutSection[]> {
    const rows = await this.db.select().from(aboutSections);
    return rows as AboutSection[];
  }

  async getAboutSection(id: string): Promise<AboutSection | undefined> {
    const rows = await this.db.select().from(aboutSections).where(eq(aboutSections.id, id));
    return rows[0] as AboutSection | undefined;
  }

  async createAboutSection(section: InsertAboutSection): Promise<AboutSection> {
    const id = randomUUID();
    const rows = await this.db.insert(aboutSections).values({ ...section, id }).returning();
    return rows[0] as AboutSection;
  }

  async updateAboutSection(id: string, section: Partial<InsertAboutSection>): Promise<AboutSection | undefined> {
    const rows = await this.db.update(aboutSections).set(section).where(eq(aboutSections.id, id)).returning();
    return rows[0] as AboutSection | undefined;
  }

  async deleteAboutSection(id: string): Promise<boolean> {
    const rows = await this.db.delete(aboutSections).where(eq(aboutSections.id, id)).returning();
    return rows.length > 0;
  }

  async getContactInfo(): Promise<ContactInfoItem[]> {
    const rows = await this.db.select().from(contactInfo);
    return rows as ContactInfoItem[];
  }

  async getContactInfoItem(id: string): Promise<ContactInfoItem | undefined> {
    const rows = await this.db.select().from(contactInfo).where(eq(contactInfo.id, id));
    return rows[0] as ContactInfoItem | undefined;
  }

  async createContactInfoItem(item: InsertContactInfo): Promise<ContactInfoItem> {
    const id = randomUUID();
    const rows = await this.db.insert(contactInfo).values({ ...item, id }).returning();
    return rows[0] as ContactInfoItem;
  }

  async updateContactInfoItem(id: string, item: Partial<InsertContactInfo>): Promise<ContactInfoItem | undefined> {
    const rows = await this.db.update(contactInfo).set(item).where(eq(contactInfo.id, id)).returning();
    return rows[0] as ContactInfoItem | undefined;
  }

  async deleteContactInfoItem(id: string): Promise<boolean> {
    const rows = await this.db.delete(contactInfo).where(eq(contactInfo.id, id)).returning();
    return rows.length > 0;
  }

  async getOrders(): Promise<Order[]> {
    const rows = await this.db.select().from(orders);
    return (rows as Order[]).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const rows = await this.db.insert(orders).values({ ...order, id }).returning();
    return rows[0] as Order;
  }
}

export const storage: IStorage = pgPool ? new DatabaseStorage() : new MemStorage();
