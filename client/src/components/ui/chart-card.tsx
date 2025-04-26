import React from "react";
import { Card } from "@/components/ui/card";

interface TimeRange {
  label: string;
  value: string;
}

interface ChartCardProps {
  title: string;
  chart: React.ReactNode;
  timeRanges?: TimeRange[];
  selectedRange?: string;
  onRangeChange?: (value: string) => void;
}

export function ChartCard({ 
  title, 
  chart, 
  timeRanges, 
  selectedRange,
  onRangeChange 
}: ChartCardProps) {
  return (
    <Card className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {timeRanges && (
          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                className={`px-3 py-1 text-xs font-medium rounded ${
                  selectedRange === range.value
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => onRangeChange && onRangeChange(range.value)}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="h-64">
        {chart}
      </div>
    </Card>
  );
}

export default ChartCard;
