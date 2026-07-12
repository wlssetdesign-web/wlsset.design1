import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "./auth";
import { ensureAuthenticated } from "./auth";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => {
      const isVideo = /\.(mp4|webm|mov|avi|mkv)$/i.test(file.originalname);
      return {
        resource_type: isVideo ? "video" : "image",
        folder: "wlsset-uploads",
        public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`,
      };
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const api = "/api";

  // ===== AUTH =====
  app.post(`${api}/admin/login`, (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials" });
      req.login(user, (err2) => {
        if (err2) return next(err2);
        return res.json({ id: user.id, username: user.username });
      });
    })(req, res, next);
  });

  app.post(`${api}/admin/logout`, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: "Logged out" });
    });
  });

  app.get(`${api}/admin/me`, (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      return res.json({ id: user.id, username: user.username });
    }
    return res.status(401).json({ message: "Not authenticated" });
  });

  // ===== PORTFOLIO =====
  app.get(`${api}/portfolio`, async (_req, res) => {
    const items = await storage.getPortfolioItems();
    res.json(items);
  });

  app.get(`${api}/portfolio/by-tag/:tag`, async (req, res) => {
    const items = await storage.getPortfolioItemsByTag(req.params.tag);
    res.json(items);
  });

  app.get(`${api}/portfolio/:id`, async (req, res) => {
    const item = await storage.getPortfolioItem(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  });

  app.post(`${api}/portfolio`, ensureAuthenticated, async (req, res) => {
    const item = await storage.createPortfolioItem(req.body);
    res.status(201).json(item);
  });

  app.put(`${api}/portfolio/:id`, ensureAuthenticated, async (req, res) => {
    const item = await storage.updatePortfolioItem(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  });

  app.put(`${api}/portfolio/:id/blocks`, ensureAuthenticated, async (req, res) => {
    const item = await storage.updatePortfolioBlocks(req.params.id, req.body.blocks);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  });

  app.delete(`${api}/portfolio/:id`, ensureAuthenticated, async (req, res) => {
    const ok = await storage.deletePortfolioItem(req.params.id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  });

  // ===== SERVICES =====
  app.get(`${api}/services`, async (_req, res) => {
    const services = await storage.getServices();
    res.json(services);
  });

  app.get(`${api}/services/:id`, async (req, res) => {
    const service = await storage.getService(req.params.id);
    if (!service) return res.status(404).json({ message: "Not found" });
    res.json(service);
  });

  app.post(`${api}/services`, ensureAuthenticated, async (req, res) => {
    const service = await storage.createService(req.body);
    res.status(201).json(service);
  });

  app.put(`${api}/services/:id`, ensureAuthenticated, async (req, res) => {
    const service = await storage.updateService(req.params.id, req.body);
    if (!service) return res.status(404).json({ message: "Not found" });
    res.json(service);
  });

  app.delete(`${api}/services/:id`, ensureAuthenticated, async (req, res) => {
    const ok = await storage.deleteService(req.params.id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  });

  // ===== ABOUT =====
  app.get(`${api}/about`, async (_req, res) => {
    const sections = await storage.getAboutSections();
    res.json(sections);
  });

  app.get(`${api}/about/:id`, async (req, res) => {
    const section = await storage.getAboutSection(req.params.id);
    if (!section) return res.status(404).json({ message: "Not found" });
    res.json(section);
  });

  app.put(`${api}/about/:id`, ensureAuthenticated, async (req, res) => {
    const section = await storage.updateAboutSection(req.params.id, req.body);
    if (!section) return res.status(404).json({ message: "Not found" });
    res.json(section);
  });

  // ===== CONTACT =====
  app.get(`${api}/contact`, async (_req, res) => {
    const items = await storage.getContactInfo();
    res.json(items);
  });

  app.post(`${api}/contact`, ensureAuthenticated, async (req, res) => {
    const item = await storage.createContactInfoItem(req.body);
    res.status(201).json(item);
  });

  app.put(`${api}/contact/:id`, ensureAuthenticated, async (req, res) => {
    const item = await storage.updateContactInfoItem(req.params.id, req.body);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  });

  app.delete(`${api}/contact/:id`, ensureAuthenticated, async (req, res) => {
    const ok = await storage.deleteContactInfoItem(req.params.id);
    if (!ok) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  });

  // ===== ORDERS =====
  app.post(`${api}/orders`, async (req, res) => {
    const order = await storage.createOrder({
      customerName: req.body.customerName,
      customerPhone: req.body.customerPhone || null,
      customerEmail: req.body.customerEmail || null,
      channel: req.body.channel,
      items: req.body.items,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json(order);
  });

  app.get(`${api}/orders`, ensureAuthenticated, async (_req, res) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  // ===== UPLOAD =====
  app.post(`${api}/upload`, ensureAuthenticated, upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const url = (req.file as any).path;
    const isVideo = (req.file as any).resource_type === "video";
    res.json({ url, filename: (req.file as any).public_id, type: isVideo ? "video" : "image" });
  });

  app.post(`${api}/upload-multiple`, ensureAuthenticated, upload.array("files", 20), (req, res) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const items = files.map((f) => {
      const url = (f as any).path;
      const isVideo = (f as any).resource_type === "video";
      return { url, filename: (f as any).public_id, type: isVideo ? "video" : "image" };
    });
    res.json({ items });
  });

  return httpServer;
}
