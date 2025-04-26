import React from "react";
import { EventStatus } from "@shared/schema";
import { getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: EventStatus | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { bg, text } = getStatusColor(status);
  
  let displayText: string;
  switch (status) {
    case EventStatus.DELIVERED:
      displayText = "Delivered";
      break;
    case EventStatus.FAILED:
      displayText = "Failed";
      break;
    case EventStatus.RETRYING:
      displayText = "Retrying";
      break;
    case EventStatus.PENDING:
      displayText = "Pending";
      break;
    default:
      displayText = status;
  }
  
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bg} ${text}`}>
      {displayText}
    </span>
  );
}

export default StatusBadge;
