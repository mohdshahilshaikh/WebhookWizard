import { EventStatus } from "@shared/schema";
import { storage } from "./storage";
import { processEvent } from "./webhooks";

// Simple in-memory queue implementation
export class WebhookQueue {
  private isProcessing = false;
  private pollInterval = 5000; // 5 seconds
  private timer: NodeJS.Timeout | null = null;

  constructor() {}

  start() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    this.timer = setInterval(() => this.processQueue(), this.pollInterval);
    console.log("Webhook queue processor started");
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log("Webhook queue processor stopped");
    }
  }

  async processQueue() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    try {
      // Get pending events
      const pendingEvents = await storage.getPendingEvents();
      
      if (pendingEvents.length > 0) {
        console.log(`Processing ${pendingEvents.length} webhook events`);
        
        // Process events one by one to avoid overwhelming the system
        for (const event of pendingEvents) {
          try {
            await processEvent(event);
          } catch (error) {
            console.error(`Error processing event ${event.id}:`, error);
          }
        }
      }
    } catch (error) {
      console.error("Error in queue processing:", error);
    } finally {
      this.isProcessing = false;
    }
  }
  
  // Manually trigger a webhook delivery (useful for retry button)
  async triggerDelivery(eventId: number) {
    try {
      const event = await storage.getEvent(eventId);
      if (!event) throw new Error(`Event ${eventId} not found`);
      
      // Reset retry counter for manual retries
      await storage.updateEvent(eventId, {
        status: EventStatus.PENDING,
        nextRetryAt: new Date(),
      });
      
      // Process immediately
      return await processEvent(event);
    } catch (error) {
      console.error(`Error triggering delivery for event ${eventId}:`, error);
      throw error;
    }
  }
}

// Create a singleton instance
export const webhookQueue = new WebhookQueue();
