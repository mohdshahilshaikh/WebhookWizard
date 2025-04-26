import React from "react";
import { Webhook } from "@shared/schema";
import { getSuccessRateColor, truncateString } from "@/lib/utils";
import { 
  MoreVertical, 
  Zap,
  ShoppingBag,
  Mail,
  Users
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";

interface WebhookCardProps {
  webhook: Webhook;
  successRate: number;
  eventCount: number;
  onDelete?: (id: number) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  "User Updates": <Zap className="h-6 w-6 text-primary-600" />,
  "Order Processing": <ShoppingBag className="h-6 w-6 text-primary-600" />,
  "Email Analytics": <Mail className="h-6 w-6 text-primary-600" />,
  "Team Updates": <Users className="h-6 w-6 text-primary-600" />,
};

export function WebhookCard({ webhook, successRate, eventCount, onDelete }: WebhookCardProps) {
  const [, navigate] = useLocation();
  
  const handleEdit = () => {
    navigate(`/webhooks/${webhook.id}`);
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(webhook.id);
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md bg-primary-100 flex items-center justify-center">
            {iconMap[webhook.name] || <Zap className="h-6 w-6 text-primary-600" />}
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-gray-900">{webhook.name}</h4>
            <span className="px-2 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              {webhook.enabled ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <MoreVertical className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-xs text-gray-500 mb-2">Endpoint</div>
      <div className="text-sm font-mono truncate mb-4">{webhook.url}</div>
      <div className="flex justify-between text-xs">
        <div>
          <span className="text-gray-500">Events:</span>
          <span className="text-gray-700 ml-1">{eventCount}</span>
        </div>
        <div>
          <span className="text-gray-500">Method:</span>
          <span className="text-gray-700 ml-1">{webhook.method}</span>
        </div>
        <div>
          <span className="text-gray-500">Success:</span>
          <span className={`ml-1 ${getSuccessRateColor(successRate)}`}>
            {successRate}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default WebhookCard;
