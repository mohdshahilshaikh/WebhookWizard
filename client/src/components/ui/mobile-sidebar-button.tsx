import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileSidebarButtonProps {
  onToggle: () => void;
}

export function MobileSidebarButton({ onToggle }: MobileSidebarButtonProps) {
  return (
    <div className="fixed z-20 top-4 left-4 md:hidden">
      <Button 
        variant="ghost" 
        size="icon" 
        className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
        onClick={onToggle}
      >
        <Menu className="h-6 w-6" />
      </Button>
    </div>
  );
}

export default MobileSidebarButton;
