import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { webhookQueue } from "./queue";
import { EventStatus, eventTypeSchema, insertWebhookSchema, webhookFormSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Start the webhook queue processor
  webhookQueue.start();

  // API routes - all prefixed with /api
  
  // Webhooks
  app.get("/api/webhooks", async (req: Request, res: Response) => {
    try {
      const webhooks = await storage.getWebhooks();
      res.json(webhooks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch webhooks" });
    }
  });

  app.get("/api/webhooks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const webhook = await storage.getWebhook(id);
      
      if (!webhook) {
        return res.status(404).json({ error: "Webhook not found" });
      }
      
      res.json(webhook);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch webhook" });
    }
  });

  app.post("/api/webhooks", async (req: Request, res: Response) => {
    try {
      const webhookData = webhookFormSchema.parse(req.body);
      const webhook = await storage.createWebhook(webhookData);
      res.status(201).json(webhook);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: fromZodError(error).message 
        });
      }
      res.status(500).json({ error: "Failed to create webhook" });
    }
  });

  app.patch("/api/webhooks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const webhook = await storage.getWebhook(id);
      
      if (!webhook) {
        return res.status(404).json({ error: "Webhook not found" });
      }
      
      const webhookData = webhookFormSchema.partial().parse(req.body);
      const updatedWebhook = await storage.updateWebhook(id, webhookData);
      res.json(updatedWebhook);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: fromZodError(error).message 
        });
      }
      res.status(500).json({ error: "Failed to update webhook" });
    }
  });

  app.delete("/api/webhooks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteWebhook(id);
      
      if (!success) {
        return res.status(404).json({ error: "Webhook not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete webhook" });
    }
  });

  // Events
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const events = await storage.getEvents(limit, offset);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/webhooks/:id/events", async (req: Request, res: Response) => {
    try {
      const webhookId = parseInt(req.params.id);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const events = await storage.getEventsByWebhook(webhookId, limit, offset);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req: Request, res: Response) => {
    try {
      const { type, webhookId, payload } = req.body;
      
      // Validate event data
      eventTypeSchema.parse({ type, payload });
      
      // Verify webhook exists
      const webhook = await storage.getWebhook(parseInt(webhookId));
      if (!webhook) {
        return res.status(404).json({ error: "Webhook not found" });
      }
      
      // Create the event
      const event = await storage.createEvent({
        webhookId: parseInt(webhookId),
        eventType: type,
        payload,
        status: EventStatus.PENDING,
      });
      
      // Trigger immediate processing
      setImmediate(() => {
        webhookQueue.processQueue();
      });
      
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: fromZodError(error).message 
        });
      }
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.post("/api/events/:id/retry", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      // Trigger a manual retry
      const updatedEvent = await webhookQueue.triggerDelivery(id);
      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ error: "Failed to retry event" });
    }
  });

  // Stats
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const counts = await storage.getEventCounts();
      const successRates = await storage.getWebhookSuccessRates();
      
      // Calculate overall success rate
      const totalDelivered = counts.delivered;
      const totalFailed = counts.failed;
      const totalAttempted = totalDelivered + totalFailed;
      const successRate = totalAttempted > 0 
        ? Math.round((totalDelivered / totalAttempted) * 100 * 10) / 10
        : 100;
      
      res.json({
        totalWebhooks: (await storage.getWebhooks()).length,
        deliveredToday: counts.delivered,
        failedToday: counts.failed,
        successRate: `${successRate}%`,
        webhookSuccessRates: successRates,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/stats/delivery", async (req: Request, res: Response) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 7;
      const stats = await storage.getDeliveryStats(days);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch delivery stats" });
    }
  });

  return httpServer;
}
