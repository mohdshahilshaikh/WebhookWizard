import React, { useState } from "react";
import { useStats } from "@/hooks/use-stats";
import { useWebhooks } from "@/hooks/use-webhooks";
import StatCard from "@/components/ui/stat-card";
import ChartCard from "@/components/ui/chart-card";
import EventLogTable from "@/components/tables/event-log-table";
import WebhookCard from "@/components/ui/webhook-card";
import { formatDateForDisplay } from "@/lib/date-utils";
import { Zap, Check, X, LineChart } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [activityTimeRange, setActivityTimeRange] = useState<string>("daily");
  const [statusTimeRange, setStatusTimeRange] = useState<string>("24h");
  
  const { stats, isLoading: statsLoading, useDeliveryStats } = useStats();
  const { webhooks, isLoading: webhooksLoading, deleteWebhook } = useWebhooks();
  
  const deliveryStatsQuery = useDeliveryStats(
    statusTimeRange === "7d" ? 7 : statusTimeRange === "30d" ? 30 : 1
  );
  
  const deliveryStats = deliveryStatsQuery.data || [];
  
  // Activity chart data
  const activityChartData = {
    labels: deliveryStats.map(stat => formatDateForDisplay(stat.date)),
    datasets: [
      {
        label: "Delivered",
        data: deliveryStats.map(stat => stat.delivered),
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Failed",
        data: deliveryStats.map(stat => stat.failed),
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  // Status chart data
  const totalDelivered = stats?.deliveredToday || 0;
  const totalFailed = stats?.failedToday || 0;
  const totalRetrying = 0; // We don't have this data yet
  
  const statusChartData = {
    labels: ["Delivered", "Failed", "Retrying"],
    datasets: [
      {
        data: [totalDelivered, totalFailed, totalRetrying],
        backgroundColor: ["#10B981", "#EF4444", "#F59E0B"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };
  
  const activityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
    },
  };
  
  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
    },
  };
  
  const activityTimeRanges = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
  ];
  
  const statusTimeRanges = [
    { label: "Last 24h", value: "24h" },
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
  ];
  
  const handleWebhookDelete = (id: number) => {
    deleteWebhook.mutate(id);
  };

  return (
    <>
      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Webhooks"
          value={statsLoading ? "Loading..." : stats?.totalWebhooks || 0}
          icon={<Zap className="h-5 w-5" />}
        />
        <StatCard
          title="Delivered Today"
          value={statsLoading ? "Loading..." : stats?.deliveredToday || 0}
          icon={<Check className="h-5 w-5" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="Failed Today"
          value={statsLoading ? "Loading..." : stats?.failedToday || 0}
          icon={<X className="h-5 w-5" />}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />
        <StatCard
          title="Success Rate"
          value={statsLoading ? "Loading..." : stats?.successRate || "0%"}
          icon={<LineChart className="h-5 w-5" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard
          title="Delivery Activity"
          chart={<Line data={activityChartData} options={activityChartOptions} />}
          timeRanges={activityTimeRanges}
          selectedRange={activityTimeRange}
          onRangeChange={setActivityTimeRange}
        />
        <ChartCard
          title="Delivery Status"
          chart={<Doughnut data={statusChartData} options={statusChartOptions} />}
          timeRanges={statusTimeRanges}
          selectedRange={statusTimeRange}
          onRangeChange={setStatusTimeRange}
        />
      </div>

      {/* Recent webhook events */}
      <div className="mb-6">
        <EventLogTable limit={4} showPagination={true} />
      </div>

      {/* Active webhooks overview */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200 px-5 py-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Active Webhooks</h3>
          <a href="/webhooks" className="text-sm font-medium text-primary-600 hover:text-primary-500">
            View all
          </a>
        </div>
        <div className="p-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {webhooksLoading ? (
            <div className="text-center col-span-3 py-4">Loading webhooks...</div>
          ) : webhooks.length === 0 ? (
            <div className="text-center col-span-3 py-4">No webhooks found</div>
          ) : (
            webhooks.slice(0, 3).map((webhook) => {
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
                  onDelete={handleWebhookDelete}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
