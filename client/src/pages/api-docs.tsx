import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CopyIcon, LucideFileCode, CheckIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ApiDocs() {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopied(section);
    toast({
      title: "Copied to clipboard",
      description: "Code snippet has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">API Documentation</h2>
        <p className="text-gray-500">
          Learn how to integrate with our webhook delivery service using our REST API.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full border-b border-gray-200 pb-px mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600">Overview</TabsTrigger>
          <TabsTrigger value="authentication" className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600">Authentication</TabsTrigger>
          <TabsTrigger value="webhooks" className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600">Webhooks</TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600">Events</TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:border-b-2 data-[state=active]:border-primary-600">Stats</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>WebhookHub API Overview</CardTitle>
              <CardDescription>
                Base URL: <code className="bg-gray-100 p-1 rounded">https://api.webhookhub.example.com/v1</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                The WebhookHub API allows you to programmatically manage webhooks, trigger events, and monitor delivery status. 
                Our RESTful API uses standard HTTP response codes, authentication, and returns JSON-encoded responses.
              </p>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">API Endpoints</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">GET</span>
                      <code className="text-sm">/webhooks</code>
                    </div>
                    <p className="text-sm text-gray-600">List all webhooks</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded">POST</span>
                      <code className="text-sm">/webhooks</code>
                    </div>
                    <p className="text-sm text-gray-600">Create a new webhook</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">GET</span>
                      <code className="text-sm">/webhooks/:id</code>
                    </div>
                    <p className="text-sm text-gray-600">Retrieve a webhook</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">PATCH</span>
                      <code className="text-sm">/webhooks/:id</code>
                    </div>
                    <p className="text-sm text-gray-600">Update a webhook</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-800 rounded">DELETE</span>
                      <code className="text-sm">/webhooks/:id</code>
                    </div>
                    <p className="text-sm text-gray-600">Delete a webhook</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded">POST</span>
                      <code className="text-sm">/events</code>
                    </div>
                    <p className="text-sm text-gray-600">Trigger a webhook event</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">GET</span>
                      <code className="text-sm">/events</code>
                    </div>
                    <p className="text-sm text-gray-600">List all events</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">GET</span>
                      <code className="text-sm">/stats</code>
                    </div>
                    <p className="text-sm text-gray-600">Get webhook delivery statistics</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">HTTP Status Codes</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <div className="w-16 text-green-600 font-mono font-semibold">200</div>
                    <div>OK - The request was successful</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-16 text-green-600 font-mono font-semibold">201</div>
                    <div>Created - The resource was successfully created</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-16 text-green-600 font-mono font-semibold">204</div>
                    <div>No Content - The request was successful but returns no content</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-16 text-yellow-600 font-mono font-semibold">400</div>
                    <div>Bad Request - The request was invalid</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-16 text-yellow-600 font-mono font-semibold">401</div>
                    <div>Unauthorized - Authentication failed or not provided</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-16 text-yellow-600 font-mono font-semibold">404</div>
                    <div>Not Found - The resource does not exist</div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-16 text-red-600 font-mono font-semibold">500</div>
                    <div>Internal Server Error - Something went wrong on our end</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Authentication */}
        <TabsContent value="authentication">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                All API requests require authentication using API keys.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                The WebhookHub API uses API keys to authenticate requests. You can view and manage your API keys in your account settings.
              </p>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">API Key Authentication</h3>
                <p>
                  Authentication is performed by including your API key in the <code className="bg-gray-100 p-1 rounded">Authorization</code> header of your HTTP requests.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-md relative">
                  <div className="font-mono text-sm">
                    <pre>Authorization: Bearer YOUR_API_KEY</pre>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-7 w-7 p-0"
                    onClick={() => handleCopy("Authorization: Bearer YOUR_API_KEY", "auth-header")}
                  >
                    {copied === "auth-header" ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Example Request</h3>
                
                <div className="bg-gray-50 p-4 rounded-md relative">
                  <div className="font-mono text-sm">
                    <pre>{`curl -X GET \\
  https://api.webhookhub.example.com/v1/webhooks \\
  -H "Authorization: Bearer wh_1a2b3c4d5e6f7g8h9i0j" \\
  -H "Content-Type: application/json"`}</pre>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-7 w-7 p-0"
                    onClick={() => handleCopy(`curl -X GET \\
  https://api.webhookhub.example.com/v1/webhooks \\
  -H "Authorization: Bearer wh_1a2b3c4d5e6f7g8h9i0j" \\
  -H "Content-Type: application/json"`, "auth-example")}
                  >
                    {copied === "auth-example" ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Security Warning</h4>
                    <p className="text-sm text-yellow-700 mt-1">Keep your API keys secure and never share them in client-side code. If you believe an API key has been compromised, generate a new one immediately.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Webhooks API</CardTitle>
              <CardDescription>
                Create, retrieve, update, and delete webhooks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded">POST</span>
                      <code className="text-sm">/webhooks</code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center text-xs"
                      onClick={() => handleCopy(`{
  "name": "User Updates",
  "url": "https://example.com/webhooks/users",
  "description": "Webhook for user-related events",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "X-Custom-Header": "custom-value"
  },
  "enabled": true,
  "retryLimit": 3,
  "retryInterval": 60
}`, "webhook-create")}
                    >
                      {copied === "webhook-create" ? (
                        <CheckIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <CopyIcon className="h-3 w-3 mr-1" />
                      )}
                      Copy Example
                    </Button>
                  </div>
                  <h3 className="text-lg font-medium">Create a Webhook</h3>
                  <p className="text-sm text-gray-600 mb-2">Create a new webhook configuration.</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Request Body</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="font-mono text-sm">
                        <pre>{`{
  "name": "User Updates",
  "url": "https://example.com/webhooks/users",
  "description": "Webhook for user-related events",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "X-Custom-Header": "custom-value"
  },
  "enabled": true,
  "retryLimit": 3,
  "retryInterval": 60
}`}</pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Response (201 Created)</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="font-mono text-sm">
                        <pre>{`{
  "id": 1,
  "name": "User Updates",
  "url": "https://example.com/webhooks/users",
  "description": "Webhook for user-related events",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "X-Custom-Header": "custom-value"
  },
  "enabled": true,
  "retryLimit": 3,
  "retryInterval": 60,
  "createdAt": "2023-04-12T15:32:10Z"
}`}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">GET</span>
                    <code className="text-sm">/webhooks</code>
                  </div>
                  <h3 className="text-lg font-medium">List All Webhooks</h3>
                  <p className="text-sm text-gray-600 mb-2">Returns a list of all webhooks.</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Response (200 OK)</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="font-mono text-sm">
                        <pre>{`[
  {
    "id": 1,
    "name": "User Updates",
    "url": "https://example.com/webhooks/users",
    "description": "Webhook for user-related events",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "enabled": true,
    "retryLimit": 3,
    "retryInterval": 60,
    "createdAt": "2023-04-12T15:32:10Z"
  },
  {
    "id": 2,
    "name": "Order Processing",
    "url": "https://orders.example.com/webhooks",
    "description": "Webhook for order-related events",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "enabled": true,
    "retryLimit": 3,
    "retryInterval": 60,
    "createdAt": "2023-04-13T09:45:22Z"
  }
]`}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">PATCH</span>
                    <code className="text-sm">/webhooks/:id</code>
                  </div>
                  <h3 className="text-lg font-medium">Update a Webhook</h3>
                  <p className="text-sm text-gray-600 mb-2">Update an existing webhook configuration.</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Request Body</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="font-mono text-sm">
                        <pre>{`{
  "enabled": false,
  "retryLimit": 5
}`}</pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Response (200 OK)</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="font-mono text-sm">
                        <pre>{`{
  "id": 1,
  "name": "User Updates",
  "url": "https://example.com/webhooks/users",
  "description": "Webhook for user-related events",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "enabled": false,
  "retryLimit": 5,
  "retryInterval": 60,
  "createdAt": "2023-04-12T15:32:10Z"
}`}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Events API</CardTitle>
              <CardDescription>
                Trigger events and monitor delivery status.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded">POST</span>
                      <code className="text-sm">/events</code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center text-xs"
                      onClick={() => handleCopy(`{
  "webhookId": 1,
  "type": "user.created",
  "payload": {
    "user_id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2023-04-14T10:23:45Z"
  }
}`, "event-create")}
                    >
                      {copied === "event-create" ? (
                        <CheckIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <CopyIcon className="h-3 w-3 mr-1" />
                      )}
                      Copy Example
                    </Button>
                  </div>
                  <h3 className="text-lg font-medium">Trigger an Event</h3>
                  <p className="text-sm text-gray-600 mb-2">Trigger a webhook event with custom payload.</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Request Body</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="font-mono text-sm">
                        <pre>{`{
  "webhookId": 1,
  "type": "user.created",
  "payload": {
    "user_id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2023-04-14T10:23:45Z"
  }
}`}</pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Response (201 Created)</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="font-mono text-sm">
                        <pre>{`{
  "id": 42,
  "webhookId": 1,
  "eventType": "user.created",
  "payload": {
    "user_id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2023-04-14T10:23:45Z"
  },
  "status": "pending",
  "attempts": 0,
  "createdAt": "2023-04-14T10:24:00Z"
}`}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">GET</span>
                    <code className="text-sm">/events</code>
                  </div>
                  <h3 className="text-lg font-medium">List All Events</h3>
                  <p className="text-sm text-gray-600 mb-2">Returns a list of all webhook events.</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Query Parameters</h4>
                    <div className="space-y-1">
                      <div className="flex">
                        <div className="w-24 font-medium">limit</div>
                        <div className="flex-1">Maximum number of events to return (default: 50)</div>
                      </div>
                      <div className="flex">
                        <div className="w-24 font-medium">offset</div>
                        <div className="flex-1">Number of events to skip (default: 0)</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Response (200 OK)</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="font-mono text-sm">
                        <pre>{`[
  {
    "id": 42,
    "webhookId": 1,
    "eventType": "user.created",
    "payload": {
      "user_id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2023-04-14T10:23:45Z"
    },
    "status": "delivered",
    "attempts": 1,
    "statusCode": 200,
    "responseBody": "{\"success\":true}",
    "duration": 156,
    "createdAt": "2023-04-14T10:24:00Z",
    "lastAttemptAt": "2023-04-14T10:24:01Z"
  },
  {
    "id": 41,
    "webhookId": 2,
    "eventType": "order.paid",
    "payload": {
      "order_id": 456,
      "amount": 99.99,
      "currency": "USD"
    },
    "status": "failed",
    "attempts": 1,
    "statusCode": 500,
    "errorMessage": "Connection refused",
    "duration": 3021,
    "createdAt": "2023-04-14T10:20:00Z",
    "lastAttemptAt": "2023-04-14T10:20:03Z",
    "nextRetryAt": "2023-04-14T10:21:03Z"
  }
]`}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded">POST</span>
                    <code className="text-sm">/events/:id/retry</code>
                  </div>
                  <h3 className="text-lg font-medium">Retry an Event</h3>
                  <p className="text-sm text-gray-600 mb-2">Manually retry a failed webhook event delivery.</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Response (200 OK)</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="font-mono text-sm">
                        <pre>{`{
  "id": 41,
  "webhookId": 2,
  "eventType": "order.paid",
  "payload": {
    "order_id": 456,
    "amount": 99.99,
    "currency": "USD"
  },
  "status": "pending",
  "attempts": 1,
  "statusCode": 500,
  "errorMessage": "Connection refused",
  "duration": 3021,
  "createdAt": "2023-04-14T10:20:00Z",
  "lastAttemptAt": "2023-04-14T10:20:03Z",
  "nextRetryAt": "2023-04-14T10:30:00Z"
}`}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Stats API</CardTitle>
              <CardDescription>
                Retrieve webhook delivery statistics.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">GET</span>
                    <code className="text-sm">/stats</code>
                  </div>
                  <h3 className="text-lg font-medium">Get Summary Statistics</h3>
                  <p className="text-sm text-gray-600 mb-2">Retrieve summary statistics for all webhooks.</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Response (200 OK)</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="font-mono text-sm">
                        <pre>{`{
  "totalWebhooks": 4,
  "deliveredToday": 356,
  "failedToday": 12,
  "successRate": "96.7%",
  "webhookSuccessRates": [
    {
      "webhookId": 1,
      "webhookName": "User Updates",
      "total": 245,
      "success": 240,
      "rate": 98
    },
    {
      "webhookId": 2,
      "webhookName": "Order Processing",
      "total": 110,
      "success": 95,
      "rate": 86
    },
    {
      "webhookId": 3,
      "webhookName": "Email Analytics",
      "total": 52,
      "success": 52,
      "rate": 100
    },
    {
      "webhookId": 4,
      "webhookName": "Team Updates",
      "total": 42,
      "success": 35,
      "rate": 83
    }
  ]
}`}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">GET</span>
                    <code className="text-sm">/stats/delivery</code>
                  </div>
                  <h3 className="text-lg font-medium">Get Delivery Statistics</h3>
                  <p className="text-sm text-gray-600 mb-2">Retrieve daily delivery statistics for the specified time period.</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Query Parameters</h4>
                    <div className="space-y-1">
                      <div className="flex">
                        <div className="w-16 font-medium">days</div>
                        <div className="flex-1">Number of days to include in the report (default: 7)</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Response (200 OK)</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="font-mono text-sm">
                        <pre>{`[
  {
    "date": "2023-04-08",
    "delivered": 312,
    "failed": 9
  },
  {
    "date": "2023-04-09",
    "delivered": 298,
    "failed": 5
  },
  {
    "date": "2023-04-10",
    "delivered": 320,
    "failed": 8
  },
  {
    "date": "2023-04-11",
    "delivered": 345,
    "failed": 11
  },
  {
    "date": "2023-04-12",
    "delivered": 332,
    "failed": 7
  },
  {
    "date": "2023-04-13",
    "delivered": 350,
    "failed": 10
  },
  {
    "date": "2023-04-14",
    "delivered": 356,
    "failed": 12
  }
]`}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex items-center justify-between p-4 border border-blue-100 bg-blue-50 rounded-md">
        <div className="flex items-start">
          <LucideFileCode className="h-6 w-6 text-blue-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Need More Help?</h3>
            <p className="text-sm text-blue-700 mt-1">
              Check out our <a href="#" className="text-blue-600 underline">API Reference</a> or 
              contact <a href="#" className="text-blue-600 underline">support@webhookhub.example.com</a> if you have any questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
