import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useEvents(webhookId?: number) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Get all events
  const eventsQuery = useQuery<Event[]>({
    queryKey: webhookId ? [`/api/webhooks/${webhookId}/events`] : ['/api/events'],
  });
  
  // Create event
  const createEvent = useMutation({
    mutationFn: async (data: { webhookId: number; type: string; payload: any }) => {
      const response = await apiRequest('POST', '/api/events', data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      if (webhookId) {
        queryClient.invalidateQueries({ queryKey: [`/api/webhooks/${webhookId}/events`] });
      }
      toast({
        title: "Event triggered",
        description: "The webhook event has been triggered successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to trigger event: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });
  
  // Retry event
  const retryEvent = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await apiRequest('POST', `/api/events/${eventId}/retry`, {});
      return await response.json();
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      if (webhookId) {
        queryClient.invalidateQueries({ queryKey: [`/api/webhooks/${webhookId}/events`] });
      }
      queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}`] });
      toast({
        title: "Event retry initiated",
        description: "The webhook delivery retry has been initiated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to retry event: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });
  
  // Get a single event
  const getEvent = (id: number) => {
    return useQuery<Event>({
      queryKey: [`/api/events/${id}`],
      enabled: !!id,
    });
  };
  
  return {
    events: eventsQuery.data || [],
    isLoading: eventsQuery.isLoading,
    isError: eventsQuery.isError,
    refetch: eventsQuery.refetch,
    createEvent,
    retryEvent,
    getEvent,
  };
}
