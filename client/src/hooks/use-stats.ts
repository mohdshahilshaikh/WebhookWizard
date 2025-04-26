import { useQuery } from "@tanstack/react-query";

interface DeliveryStats {
  date: string;
  delivered: number;
  failed: number;
}

interface WebhookSuccessRate {
  webhookId: number;
  webhookName: string;
  total: number;
  success: number;
  rate: number;
}

interface DashboardStats {
  totalWebhooks: number;
  deliveredToday: number;
  failedToday: number;
  successRate: string;
  webhookSuccessRates: WebhookSuccessRate[];
}

export function useStats() {
  // Get dashboard stats
  const statsQuery = useQuery<DashboardStats>({
    queryKey: ['/api/stats'],
  });
  
  // Get delivery stats with custom time range
  const useDeliveryStats = (days: number = 7) => {
    return useQuery<DeliveryStats[]>({
      queryKey: [`/api/stats/delivery?days=${days}`],
    });
  };
  
  return {
    stats: statsQuery.data,
    isLoading: statsQuery.isLoading,
    isError: statsQuery.isError,
    refetch: statsQuery.refetch,
    useDeliveryStats,
  };
}
