import React from "react";
import { useLocation, Link } from "wouter";
import { 
  Home, 
  Zap, 
  Clipboard, 
  Settings, 
  FileCode 
} from "lucide-react";
import UserProfile from "./user-profile";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  
  const sidebarClasses = isOpen
    ? "fixed inset-y-0 left-0 transform translate-x-0 md:translate-x-0 z-10 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out"
    : "fixed inset-y-0 left-0 transform -translate-x-full md:translate-x-0 z-10 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out";
  
  const isActivePath = (path: string) => {
    if (path === "/" && location !== "/") return false;
    return location === path || location.startsWith(`${path}/`);
  };
  
  return (
    <div className={sidebarClasses}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <div className="text-xl font-semibold text-primary-600 flex items-center">
            <Zap className="h-6 w-6 mr-2" />
            WebhookHub
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            <li>
              <Link href="/">
                <a 
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActivePath("/")
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => onClose()}
                >
                  <Home className="h-5 w-5 mr-3" />
                  Dashboard
                </a>
              </Link>
            </li>
            <li>
              <Link href="/webhooks">
                <a 
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActivePath("/webhooks")
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => onClose()}
                >
                  <Zap className="h-5 w-5 mr-3" />
                  Webhooks
                </a>
              </Link>
            </li>
            <li>
              <Link href="/events">
                <a 
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActivePath("/events")
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => onClose()}
                >
                  <Clipboard className="h-5 w-5 mr-3" />
                  Event Logs
                </a>
              </Link>
            </li>
            <li>
              <Link href="/settings">
                <a 
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActivePath("/settings")
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => onClose()}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </a>
              </Link>
            </li>
            <li>
              <Link href="/api-docs">
                <a 
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActivePath("/api-docs")
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => onClose()}
                >
                  <FileCode className="h-5 w-5 mr-3" />
                  API Docs
                </a>
              </Link>
            </li>
          </ul>
        </nav>

        {/* User profile */}
        <UserProfile />
      </div>
    </div>
  );
}

export default Sidebar;
