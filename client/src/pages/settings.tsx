import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Clock, 
  Key, 
  Lock, 
  Save, 
  Shield, 
  User, 
  Webhook 
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveGeneral = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings saved",
        description: "Your general settings have been saved successfully.",
      });
    }, 1000);
  };

  const handleSaveNotifications = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Notification settings saved",
        description: "Your notification preferences have been updated.",
      });
    }, 1000);
  };

  const handleGenerateAPIKey = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "API key generated",
        description: "Your new API key has been generated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h2>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security & API</TabsTrigger>
          <TabsTrigger value="webhooks">Webhook Defaults</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex items-center space-x-4">
                    <User className="h-5 w-5 text-gray-400" />
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <Input id="email" type="email" defaultValue="john@example.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <div className="flex items-center space-x-4">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <select id="timezone" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="UTC-8">Pacific Time (UTC-8)</option>
                      <option value="UTC-5">Eastern Time (UTC-5)</option>
                      <option value="UTC+0">Coordinated Universal Time (UTC)</option>
                      <option value="UTC+1">Central European Time (UTC+1)</option>
                      <option value="UTC+5:30">Indian Standard Time (UTC+5:30)</option>
                      <option value="UTC+8">China Standard Time (UTC+8)</option>
                      <option value="UTC+9">Japan Standard Time (UTC+9)</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveGeneral} 
                disabled={isLoading}
                className="bg-primary-600 hover:bg-primary-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-start space-x-3">
                    <Bell className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Webhook Failures</div>
                      <div className="text-sm text-gray-500">Receive notifications when webhook deliveries fail</div>
                    </div>
                  </div>
                  <Switch defaultChecked={true} id="notification-failures" />
                </div>
                
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-start space-x-3">
                    <Bell className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Delivery Success</div>
                      <div className="text-sm text-gray-500">Receive notifications for successful webhook deliveries</div>
                    </div>
                  </div>
                  <Switch defaultChecked={false} id="notification-success" />
                </div>
                
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-start space-x-3">
                    <Bell className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Daily Summary</div>
                      <div className="text-sm text-gray-500">Receive a daily summary of webhook activity</div>
                    </div>
                  </div>
                  <Switch defaultChecked={true} id="notification-summary" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <div className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <Input id="email-notifications" type="email" defaultValue="john@example.com" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveNotifications} 
                disabled={isLoading}
                className="bg-primary-600 hover:bg-primary-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security & API Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security & API</CardTitle>
              <CardDescription>Manage security settings and API access.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="api-key">API Key</Label>
                    <Button variant="outline" size="sm" onClick={handleGenerateAPIKey}>
                      <Key className="h-4 w-4 mr-2" />
                      Generate New Key
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Key className="h-5 w-5 text-gray-400" />
                    <div className="relative flex-1">
                      <Input 
                        id="api-key" 
                        value="wh_1a2b3c4d5e6f7g8h9i0j" 
                        readOnly 
                        className="pr-20 font-mono text-sm"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-1 top-1 h-7 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText("wh_1a2b3c4d5e6f7g8h9i0j");
                          toast({
                            title: "Copied!",
                            description: "API key copied to clipboard",
                          });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Last used: 2 hours ago</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="flex items-center space-x-4">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <Input id="current-password" type="password" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="flex items-center space-x-4">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <Input id="new-password" type="password" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="flex items-center space-x-4">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-gray-500">Add an extra layer of security to your account</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Webhook Default Settings */}
        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Default Settings</CardTitle>
              <CardDescription>Configure default settings for new webhooks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-retry-limit">Default Retry Limit</Label>
                  <div className="flex items-center space-x-4">
                    <Webhook className="h-5 w-5 text-gray-400" />
                    <Input 
                      id="default-retry-limit" 
                      type="number" 
                      defaultValue="3" 
                      min="0" 
                      max="10" 
                    />
                  </div>
                  <p className="text-sm text-gray-500">Maximum number of retry attempts (0-10)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-retry-interval">Default Retry Interval (seconds)</Label>
                  <div className="flex items-center space-x-4">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <Input 
                      id="default-retry-interval" 
                      type="number" 
                      defaultValue="60" 
                      min="5" 
                      max="3600" 
                    />
                  </div>
                  <p className="text-sm text-gray-500">Time between retry attempts (5-3600 seconds)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-method">Default HTTP Method</Label>
                  <div className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                    <select id="default-method" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="GET">GET</option>
                      <option value="POST" selected>POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-start space-x-3">
                    <Webhook className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">Enable Webhooks by Default</div>
                      <div className="text-sm text-gray-500">Automatically enable new webhooks when created</div>
                    </div>
                  </div>
                  <Switch defaultChecked={true} id="default-enabled" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="default-headers">Default Headers</Label>
                  <div className="flex items-center space-x-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400">
                      <path d="M21 2H3v16h5v4l4-4h4l5-5V2zM12 8v4M8 9v2" />
                    </svg>
                    <Input 
                      id="default-headers" 
                      defaultValue='{"Content-Type": "application/json"}' 
                      className="font-mono text-sm"
                    />
                  </div>
                  <p className="text-sm text-gray-500">Default headers in JSON format</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Save className="h-4 w-4 mr-2" />
                Save Default Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
