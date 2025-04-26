import React from "react";

export function UserProfile() {
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center">
            <span className="text-sm font-medium">JD</span>
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700">John Doe</p>
          <p className="text-xs text-gray-500">john@example.com</p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
