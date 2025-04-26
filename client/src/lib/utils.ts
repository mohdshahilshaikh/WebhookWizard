import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EventStatus } from "@shared/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: Date | string | undefined): string {
  if (!timestamp) return "N/A";

  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) {
    return "Just now";
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

export function formatDuration(durationMs: number | undefined): string {
  if (durationMs === undefined) return "N/A";
  
  if (durationMs < 1000) {
    return `${durationMs} ms`;
  } else {
    const durationSec = durationMs / 1000;
    return `${durationSec.toFixed(1)} s`;
  }
}

export function getStatusColor(status: EventStatus | string): { bg: string; text: string } {
  switch (status) {
    case EventStatus.DELIVERED:
      return { bg: "bg-green-100", text: "text-green-800" };
    case EventStatus.FAILED:
      return { bg: "bg-red-100", text: "text-red-800" };
    case EventStatus.RETRYING:
      return { bg: "bg-yellow-100", text: "text-yellow-800" };
    case EventStatus.PENDING:
      return { bg: "bg-blue-100", text: "text-blue-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
}

export function truncateString(str: string, maxLength: number = 40): string {
  if (!str || str.length <= maxLength) return str;
  return `${str.substring(0, maxLength)}...`;
}

export function getSuccessRateColor(rate: number): string {
  if (rate >= 95) return "text-green-600";
  if (rate >= 80) return "text-yellow-600";
  return "text-red-600";
}

export function getEventTypeIcon(eventType: string): string {
  const eventCategory = eventType.split('.')[0].toLowerCase();
  
  switch (eventCategory) {
    case 'user':
      return "user";
    case 'order':
      return "shopping-bag";
    case 'email':
      return "mail";
    case 'team':
      return "users";
    case 'payment':
      return "credit-card";
    case 'file':
      return "file-text";
    default:
      return "zap";
  }
}

export function generateRandomId(): string {
  return `evt_${Math.random().toString(36).substring(2, 10)}`;
}
