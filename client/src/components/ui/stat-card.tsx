import React from "react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

export function StatCard({ title, value, icon, iconBgColor = "bg-primary-100", iconColor = "text-primary-600" }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3`}>
          <div className={`h-5 w-5 ${iconColor}`}>
            {icon}
          </div>
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}

export default StatCard;
