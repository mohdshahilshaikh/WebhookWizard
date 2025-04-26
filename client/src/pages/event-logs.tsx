import React from "react";
import EventLogTable from "@/components/tables/event-log-table";

export default function EventLogs() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Event Logs</h2>
        <p className="text-gray-500 mb-6">View all webhook delivery attempts and their statuses.</p>
      </div>
      
      <EventLogTable showPagination={true} />
    </div>
  );
}
