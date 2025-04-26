import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertWebhook, Webhook } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useWebhooks() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Get all webhooks
  const webhooksQuery = useQuery<Webhook[]>({
    queryKey: ['/api/webhooks'],
  });
  
  // Create webhook
  const createWebhook = useMutation({
    mutationFn: async (data: InsertWebhook) => {
      const response = await apiRequest('POST', '/api/webhooks', data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webhooks'] });
      toast({
        title: "Webhook created",
        description: "The webhook has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create webhook: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });
  
  // Update webhook
  const updateWebhook = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertWebhook> }) => {
      const response = await apiRequest('PATCH', `/api/webhooks/${id}`, data);
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/webhooks'] });
      queryClient.invalidateQueries({ queryKey: [`/api/webhooks/${variables.id}`] });
      toast({
        title: "Webhook updated",
        description: "The webhook has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update webhook: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });
  
  // Delete webhook
  const deleteWebhook = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/webhooks/${id}`, undefined);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/webhooks'] });
      toast({
        title: "Webhook deleted",
        description: "The webhook has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete webhook: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });
  
  // Get a single webhook
  const getWebhook = (id: number) => {
    return useQuery<Webhook>({
      queryKey: [`/api/webhooks/${id}`],
      enabled: !!id,
    });
  };
  
  return {
    webhooks: webhooksQuery.data || [],
    isLoading: webhooksQuery.isLoading,
    isError: webhooksQuery.isError,
    refetch: webhooksQuery.refetch,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    getWebhook,
  };
}
