import fetch from "node-fetch";
import { Event, EventStatus, Webhook } from "@shared/schema";
import { storage } from "./storage";

// Retry configuration
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_INTERVALS = [60, 300, 900]; // in seconds (1min, 5min, 15min)

export async function processEvent(event: Event): Promise<Event> {
  const webhook = await storage.getWebhook(event.webhookId);
  if (!webhook || !webhook.enabled) {
    return await storage.updateEvent(event.id, {
      status: EventStatus.FAILED,
      errorMessage: webhook ? "Webhook is disabled" : "Webhook not found",
      attempts: event.attempts + 1,
      lastAttemptAt: new Date(),
    }) as Event;
  }

  try {
    // Update event status to indicate it's being processed
    await storage.updateEvent(event.id, {
      status: EventStatus.RETRYING,
      attempts: event.attempts + 1,
      lastAttemptAt: new Date(),
    });

    // Deliver the webhook
    const result = await deliverWebhook(webhook, event);
    
    // Update event with result
    return await storage.updateEvent(event.id, {
      status: result.success ? EventStatus.DELIVERED : EventStatus.FAILED,
      statusCode: result.statusCode,
      responseBody: result.responseBody,
      errorMessage: result.errorMessage,
      duration: result.duration,
      nextRetryAt: result.nextRetry,
    }) as Event;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Schedule retry if under retry limit
    let nextRetry: Date | undefined = undefined;
    const shouldRetry = event.attempts < (webhook.retryLimit || MAX_RETRY_ATTEMPTS);
    
    if (shouldRetry) {
      const retryIndex = Math.min(event.attempts, RETRY_INTERVALS.length - 1);
      const retryDelay = webhook.retryInterval || RETRY_INTERVALS[retryIndex];
      nextRetry = new Date(Date.now() + retryDelay * 1000);
    }
    
    return await storage.updateEvent(event.id, {
      status: shouldRetry ? EventStatus.RETRYING : EventStatus.FAILED,
      errorMessage,
      nextRetryAt: nextRetry,
    }) as Event;
  }
}

async function deliverWebhook(webhook: Webhook, event: Event): Promise<{
  success: boolean;
  statusCode?: number;
  responseBody?: string;
  errorMessage?: string;
  duration: number;
  nextRetry?: Date;
}> {
  const startTime = Date.now();
  
  try {
    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "WebhookHub/1.0",
      "X-Webhook-ID": webhook.id.toString(),
      "X-Event-ID": event.id.toString(),
      "X-Event-Type": event.eventType,
      ...(webhook.headers as Record<string, string>),
    };

    // Send the request
    const response = await fetch(webhook.url, {
      method: webhook.method,
      headers,
      body: JSON.stringify({
        id: event.id,
        type: event.eventType,
        created_at: event.createdAt,
        attempt: event.attempts,
        data: event.payload,
      }),
      timeout: 10000, // 10 second timeout
    });

    const duration = Date.now() - startTime;
    const responseBody = await response.text();
    
    // Determine if request was successful (2xx status code)
    const success = response.status >= 200 && response.status < 300;
    
    // If failed, determine if we should retry
    let nextRetry: Date | undefined = undefined;
    if (!success && event.attempts < (webhook.retryLimit || MAX_RETRY_ATTEMPTS)) {
      const retryIndex = Math.min(event.attempts, RETRY_INTERVALS.length - 1);
      const retryDelay = webhook.retryInterval || RETRY_INTERVALS[retryIndex];
      nextRetry = new Date(Date.now() + retryDelay * 1000);
    }

    return {
      success,
      statusCode: response.status,
      responseBody,
      duration,
      nextRetry,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Determine if we should retry
    let nextRetry: Date | undefined = undefined;
    if (event.attempts < (webhook.retryLimit || MAX_RETRY_ATTEMPTS)) {
      const retryIndex = Math.min(event.attempts, RETRY_INTERVALS.length - 1);
      const retryDelay = webhook.retryInterval || RETRY_INTERVALS[retryIndex];
      nextRetry = new Date(Date.now() + retryDelay * 1000);
    }
    
    return {
      success: false,
      errorMessage,
      duration,
      nextRetry,
    };
  }
}
