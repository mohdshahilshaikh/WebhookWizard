import { 
  User, InsertUser, 
  Webhook, InsertWebhook, 
  Event, InsertEvent,
  EventStatus,
  users, webhooks, events
} from "@shared/schema";

// Storage interface with CRUD methods
export interface IStorage {
  // User methods (keeping original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Webhook methods
  getWebhooks(): Promise<Webhook[]>;
  getWebhook(id: number): Promise<Webhook | undefined>;
  createWebhook(webhook: InsertWebhook): Promise<Webhook>;
  updateWebhook(id: number, webhook: Partial<InsertWebhook>): Promise<Webhook | undefined>;
  deleteWebhook(id: number): Promise<boolean>;
  
  // Event methods
  getEvents(limit?: number, offset?: number): Promise<Event[]>;
  getEventsByWebhook(webhookId: number, limit?: number, offset?: number): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<Event>): Promise<Event | undefined>;
  getPendingEvents(): Promise<Event[]>;
  getEventCounts(): Promise<{
    total: number;
    delivered: number;
    failed: number;
    retrying: number;
    pending: number;
  }>;
  getDeliveryStats(days: number): Promise<{
    date: string;
    delivered: number;
    failed: number;
  }[]>;
  getWebhookSuccessRates(): Promise<{
    webhookId: number;
    webhookName: string;
    total: number;
    success: number;
    rate: number;
  }[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private webhooks: Map<number, Webhook>;
  private events: Map<number, Event>;
  private userIdCounter: number;
  private webhookIdCounter: number;
  private eventIdCounter: number;

  constructor() {
    this.users = new Map();
    this.webhooks = new Map();
    this.events = new Map();
    this.userIdCounter = 1;
    this.webhookIdCounter = 1;
    this.eventIdCounter = 1;
    
    // Add some sample data
    this.initSampleData();
  }

  private initSampleData() {
    // Create some sample webhooks
    const webhook1: InsertWebhook = {
      name: "User Updates",
      url: "https://api.example.com/webhooks/users",
      description: "Webhooks for user-related events",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      enabled: true,
      retryLimit: 3,
      retryInterval: 60,
    };

    const webhook2: InsertWebhook = {
      name: "Order Processing",
      url: "https://orders.example.com/webhooks",
      description: "Webhooks for order-related events",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      enabled: true,
      retryLimit: 3,
      retryInterval: 60,
    };

    const webhook3: InsertWebhook = {
      name: "Email Analytics",
      url: "https://mail.example.com/hooks/track",
      description: "Webhooks for email-related events",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      enabled: true,
      retryLimit: 3,
      retryInterval: 60,
    };

    const webhook4: InsertWebhook = {
      name: "Team Updates",
      url: "https://teams.example.com/webhook",
      description: "Webhooks for team-related events",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      enabled: true,
      retryLimit: 3,
      retryInterval: 60,
    };

    this.createWebhook(webhook1);
    this.createWebhook(webhook2);
    this.createWebhook(webhook3);
    this.createWebhook(webhook4);

    // Create some sample events
    const now = new Date();
    const event1: InsertEvent = {
      webhookId: 1,
      eventType: "user.created",
      payload: { user_id: 123, name: "John Doe" },
      status: EventStatus.DELIVERED,
    };

    const event2: InsertEvent = {
      webhookId: 2,
      eventType: "order.paid",
      payload: { order_id: 456, amount: 99.99 },
      status: EventStatus.FAILED,
    };

    const event3: InsertEvent = {
      webhookId: 3,
      eventType: "email.sent",
      payload: { email_id: 789, recipient: "user@example.com" },
      status: EventStatus.DELIVERED,
    };

    const event4: InsertEvent = {
      webhookId: 4,
      eventType: "team.updated",
      payload: { team_id: 101, name: "Engineering" },
      status: EventStatus.RETRYING,
    };

    this.createEvent(event1);
    this.createEvent(event2);
    this.createEvent(event3);
    this.createEvent(event4);

    // Create additional events for stats
    for (let i = 0; i < 10; i++) {
      const webhookId = Math.floor(Math.random() * 4) + 1;
      const status = Math.random() > 0.2 ? EventStatus.DELIVERED : EventStatus.FAILED;
      const eventType = ["user.updated", "order.shipped", "email.opened", "team.member.added"][Math.floor(Math.random() * 4)];
      
      const pastTime = new Date(now);
      pastTime.setHours(now.getHours() - Math.floor(Math.random() * 72));
      
      const event: InsertEvent = {
        webhookId,
        eventType,
        payload: { id: Math.floor(Math.random() * 1000) },
        status,
      };
      
      const createdEvent = this.createEvent(event);
      
      // Update timestamp for historical data
      const updatedEvent = { ...createdEvent, createdAt: pastTime };
      this.events.set(createdEvent.id, updatedEvent);
    }
  }

  // User methods (keeping original implementation)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Webhook methods
  async getWebhooks(): Promise<Webhook[]> {
    return Array.from(this.webhooks.values());
  }

  async getWebhook(id: number): Promise<Webhook | undefined> {
    return this.webhooks.get(id);
  }

  async createWebhook(webhook: InsertWebhook): Promise<Webhook> {
    const id = this.webhookIdCounter++;
    const now = new Date();
    const newWebhook: Webhook = { ...webhook, id, createdAt: now };
    this.webhooks.set(id, newWebhook);
    return newWebhook;
  }

  async updateWebhook(id: number, webhook: Partial<InsertWebhook>): Promise<Webhook | undefined> {
    const existingWebhook = this.webhooks.get(id);
    if (!existingWebhook) return undefined;
    
    const updatedWebhook = { ...existingWebhook, ...webhook };
    this.webhooks.set(id, updatedWebhook);
    return updatedWebhook;
  }

  async deleteWebhook(id: number): Promise<boolean> {
    return this.webhooks.delete(id);
  }

  // Event methods
  async getEvents(limit: number = 50, offset: number = 0): Promise<Event[]> {
    const events = Array.from(this.events.values())
      .sort((a, b) => {
        const aDate = a.createdAt || new Date(0);
        const bDate = b.createdAt || new Date(0);
        return bDate.getTime() - aDate.getTime();
      });
    
    return events.slice(offset, offset + limit);
  }

  async getEventsByWebhook(webhookId: number, limit: number = 50, offset: number = 0): Promise<Event[]> {
    const events = Array.from(this.events.values())
      .filter(event => event.webhookId === webhookId)
      .sort((a, b) => {
        const aDate = a.createdAt || new Date(0);
        const bDate = b.createdAt || new Date(0);
        return bDate.getTime() - aDate.getTime();
      });
    
    return events.slice(offset, offset + limit);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const now = new Date();
    const newEvent: Event = { 
      ...event, 
      id, 
      attempts: 0,
      createdAt: now,
      lastAttemptAt: event.status !== EventStatus.PENDING ? now : undefined,
      nextRetryAt: event.status === EventStatus.RETRYING ? new Date(now.getTime() + 60000) : undefined,
      duration: Math.floor(Math.random() * 500) + 100, // Random duration for sample data
      statusCode: event.status === EventStatus.DELIVERED ? 200 : event.status === EventStatus.FAILED ? 500 : undefined,
      responseBody: event.status === EventStatus.DELIVERED ? '{"success":true}' : undefined,
      errorMessage: event.status === EventStatus.FAILED ? 'Connection refused' : undefined,
    };
    
    this.events.set(id, newEvent);
    return newEvent;
  }

  async updateEvent(id: number, event: Partial<Event>): Promise<Event | undefined> {
    const existingEvent = this.events.get(id);
    if (!existingEvent) return undefined;
    
    const updatedEvent = { ...existingEvent, ...event };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async getPendingEvents(): Promise<Event[]> {
    return Array.from(this.events.values())
      .filter(event => 
        event.status === EventStatus.PENDING || 
        (event.status === EventStatus.RETRYING && 
         event.nextRetryAt && 
         event.nextRetryAt <= new Date())
      )
      .sort((a, b) => {
        const aDate = a.createdAt || new Date(0);
        const bDate = b.createdAt || new Date(0);
        return aDate.getTime() - bDate.getTime();
      });
  }

  async getEventCounts(): Promise<{
    total: number;
    delivered: number;
    failed: number;
    retrying: number;
    pending: number;
  }> {
    const events = Array.from(this.events.values());
    
    // Count today's events (last 24 hours)
    const now = new Date();
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const todayEvents = events.filter(e => {
      const eventDate = e.createdAt || new Date(0);
      return eventDate >= oneDayAgo;
    });
    
    return {
      total: events.length,
      delivered: todayEvents.filter(e => e.status === EventStatus.DELIVERED).length,
      failed: todayEvents.filter(e => e.status === EventStatus.FAILED).length,
      retrying: todayEvents.filter(e => e.status === EventStatus.RETRYING).length,
      pending: todayEvents.filter(e => e.status === EventStatus.PENDING).length,
    };
  }

  async getDeliveryStats(days: number = 7): Promise<{
    date: string;
    delivered: number;
    failed: number;
  }[]> {
    const events = Array.from(this.events.values());
    const now = new Date();
    const stats: {[key: string]: {delivered: number, failed: number}} = {};
    
    // Initialize stats for last n days
    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      stats[dateStr] = { delivered: 0, failed: 0 };
    }
    
    // Count events by day
    events.forEach(event => {
      const eventDate = event.createdAt || new Date(0);
      const dateStr = eventDate.toISOString().split('T')[0];
      
      if (stats[dateStr]) {
        if (event.status === EventStatus.DELIVERED) {
          stats[dateStr].delivered++;
        } else if (event.status === EventStatus.FAILED) {
          stats[dateStr].failed++;
        }
      }
    });
    
    // Convert to array sorted by date
    return Object.entries(stats)
      .map(([date, counts]) => ({
        date,
        delivered: counts.delivered,
        failed: counts.failed,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getWebhookSuccessRates(): Promise<{
    webhookId: number;
    webhookName: string;
    total: number;
    success: number;
    rate: number;
  }[]> {
    const webhooks = await this.getWebhooks();
    const result = [];
    
    for (const webhook of webhooks) {
      const events = Array.from(this.events.values())
        .filter(e => e.webhookId === webhook.id);
      
      const total = events.length;
      const success = events.filter(e => e.status === EventStatus.DELIVERED).length;
      const rate = total > 0 ? Math.round((success / total) * 100) : 100;
      
      result.push({
        webhookId: webhook.id,
        webhookName: webhook.name,
        total,
        success,
        rate,
      });
    }
    
    return result;
  }
}

export const storage = new MemStorage();
