import React from "react";
import { useWebhooks } from "@/hooks/use-webhooks";
import { useStats } from "@/hooks/use-stats";
import WebhookCard from "@/components/ui/webhook-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function Webhooks() {
  const [, navigate] = useLocation();
  const { webhooks, isLoading, isError, deleteWebhook } = useWebhooks();
  const { stats } = useStats();
  
  const handleCreateWebhook = () => {
    navigate("/webhooks/create");
  };
  
  const handleDeleteWebhook = (id: number) => {
    deleteWebhook.mutate(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">All Webhooks</h2>
        <Button 
          onClick={handleCreateWebhook}
          className="bg-primary-600 hover:bg-primary-700 text-white"
        >
          <Plus className="h-5 w-5 mr-1" />
          Create Webhook
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading webhooks...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-10">
          <p className="text-red-500">Failed to load webhooks. Please try again.</p>
        </div>
      ) : webhooks.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Webhooks Found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first webhook.</p>
          <Button 
            onClick={handleCreateWebhook}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            <Plus className="h-5 w-5 mr-1" />
            Create Webhook
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {webhooks.map((webhook) => {
            const successRate = stats?.webhookSuccessRates?.find(
              (rate) => rate.webhookId === webhook.id
            )?.rate || 100;
            const eventCount = stats?.webhookSuccessRates?.find(
              (rate) => rate.webhookId === webhook.id
            )?.total || 0;
            
            return (
              <WebhookCard
                key={webhook.id}
                webhook={webhook}
                successRate={successRate}
                eventCount={eventCount}
                onDelete={handleDeleteWebhook}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
