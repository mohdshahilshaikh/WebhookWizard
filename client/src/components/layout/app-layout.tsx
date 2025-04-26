import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "./sidebar";
import MobileSidebarButton from "@/components/ui/mobile-sidebar-button";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location, navigate] = useLocation();
  
  // Get the page title based on the current path
  const getPageTitle = () => {
    if (location === "/") return "Dashboard";
    if (location.startsWith("/webhooks/create")) return "Create Webhook";
    if (location.startsWith("/webhooks")) return "Webhooks";
    if (location.startsWith("/events")) return "Event Logs";
    if (location.startsWith("/settings")) return "Settings";
    if (location.startsWith("/api-docs")) return "API Documentation";
    
    return "Dashboard";
  };

  // Close sidebar when route changes (on mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);
  
  // Handle create webhook button click
  const handleCreateWebhook = () => {
    navigate("/webhooks/create");
  };
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      <MobileSidebarButton onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Top navigation */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
            <div className="flex items-center">
              {(location === "/webhooks" || location === "/") && (
                <Button 
                  onClick={handleCreateWebhook}
                  className="ml-4 bg-primary-600 hover:bg-primary-700 text-white"
                >
                  <span className="hidden md:inline-block">Create Webhook</span>
                  <Plus className="md:hidden h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
