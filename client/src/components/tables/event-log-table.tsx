import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Event, Webhook } from "@shared/schema";
import StatusBadge from "@/components/ui/status-badge";
import { formatTimestamp, formatDuration, truncateString, getEventTypeIcon } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { Zap, ShoppingBag, Mail, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EventLogTableProps {
  webhookId?: number;
  limit?: number;
  showPagination?: boolean;
}

export function EventLogTable({ webhookId, limit = 50, showPagination = true }: EventLogTableProps) {
  const { toast } = useToast();
  const [page, setPage] = React.useState(1);
  const pageSize = limit;
  const offset = (page - 1) * pageSize;
  
  const eventsQuery = useQuery<Event[]>({
    queryKey: webhookId 
      ? [`/api/webhooks/${webhookId}/events?limit=${pageSize}&offset=${offset}`] 
      : [`/api/events?limit=${pageSize}&offset=${offset}`],
  });
  
  const webhooksQuery = useQuery<Webhook[]>({
    queryKey: ['/api/webhooks'],
  });
  
  const events = eventsQuery.data || [];
  const webhooks = webhooksQuery.data || [];
  
  // Get webhook name by ID
  const getWebhookName = (id: number) => {
    const webhook = webhooks.find(w => w.id === id);
    return webhook ? webhook.name : `Webhook ${id}`;
  };
  
  // Get webhook URL by ID
  const getWebhookUrl = (id: number) => {
    const webhook = webhooks.find(w => w.id === id);
    return webhook ? webhook.url : '';
  };
  
  // Get appropriate icon for event type
  const getIcon = (eventType: string | undefined) => {
    if (!eventType) return <Zap className="h-4 w-4 text-primary-600" />;
    
    const type = eventType.split('.')[0];
    switch (type) {
      case 'user':
        return <Zap className="h-4 w-4 text-primary-600" />;
      case 'order':
        return <ShoppingBag className="h-4 w-4 text-primary-600" />;
      case 'email':
        return <Mail className="h-4 w-4 text-primary-600" />;
      case 'team':
        return <Users className="h-4 w-4 text-primary-600" />;
      default:
        return <Zap className="h-4 w-4 text-primary-600" />;
    }
  };
  
  // Handle retry event
  const handleRetry = async (eventId: number) => {
    try {
      await apiRequest('POST', `/api/events/${eventId}/retry`, {});
      toast({
        title: "Event retry initiated",
        description: "The webhook delivery retry has been initiated.",
      });
      // Refresh the event list
      eventsQuery.refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retry the webhook delivery.",
        variant: "destructive",
      });
    }
  };

  if (eventsQuery.isLoading) {
    return <div className="text-center py-4">Loading events...</div>;
  }

  if (eventsQuery.isError) {
    return <div className="text-center py-4 text-red-500">Failed to load events</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Webhook</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                      {getIcon(event.eventType)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{event.eventType}</div>
                      <div className="text-sm text-gray-500">evt_{event.id.toString().padStart(8, '0')}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{getWebhookName(event.webhookId)}</div>
                  <div className="text-sm text-gray-500">{truncateString(getWebhookUrl(event.webhookId), 30)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={event.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTimestamp(event.createdAt || undefined)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDuration(event.duration || undefined)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="link"
                    className="text-primary-600 hover:text-primary-900"
                    onClick={() => handleRetry(event.id)}
                  >
                    {event.status === 'failed' ? 'Retry' : 'View'}
                  </Button>
                </td>
              </tr>
            ))}
            
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No events found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {showPagination && (
        <div className="bg-gray-50 px-5 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={events.length < pageSize}
              onClick={() => setPage(page + 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{offset + 1}</span> to{" "}
                <span className="font-medium">{offset + events.length}</span> of{" "}
                <span className="font-medium">many</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {page}
                </Button>
                <Button
                  variant="outline"
                  disabled={events.length < pageSize}
                  onClick={() => setPage(page + 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventLogTable;
