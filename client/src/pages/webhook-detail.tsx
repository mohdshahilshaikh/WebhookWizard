import React, { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useWebhooks } from "@/hooks/use-webhooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertWebhook, HttpMethod, webhookFormSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventLogTable from "@/components/tables/event-log-table";
import { useStats } from "@/hooks/use-stats";
import { ChevronLeft, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function WebhookDetail() {
  const [, params] = useRoute<{ id: string }>("/webhooks/:id");
  const [, navigate] = useLocation();
  const id = params ? parseInt(params.id) : 0;
  
  const { getWebhook, updateWebhook, deleteWebhook } = useWebhooks();
  const { stats } = useStats();
  
  const { data: webhook, isLoading, isError } = getWebhook(id);
  
  const form = useForm<InsertWebhook>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      name: "",
      url: "",
      description: "",
      method: "POST",
      headers: {},
      enabled: true,
      retryLimit: 3,
      retryInterval: 60,
    },
  });
  
  useEffect(() => {
    if (webhook) {
      form.reset({
        name: webhook.name,
        url: webhook.url,
        description: webhook.description || "",
        method: webhook.method,
        headers: webhook.headers || {},
        enabled: webhook.enabled,
        retryLimit: webhook.retryLimit,
        retryInterval: webhook.retryInterval,
      });
    }
  }, [webhook, form]);
  
  const onSubmit = (data: InsertWebhook) => {
    updateWebhook.mutate({ id, data });
  };
  
  const handleDelete = () => {
    deleteWebhook.mutate(id, {
      onSuccess: () => {
        navigate("/webhooks");
      },
    });
  };
  
  const handleBack = () => {
    navigate("/webhooks");
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Loading webhook details...</p>
      </div>
    );
  }
  
  if (isError || !webhook) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Failed to load webhook. The webhook may have been deleted.</p>
        <Button variant="outline" className="mt-4" onClick={handleBack}>
          Back to Webhooks
        </Button>
      </div>
    );
  }
  
  const successRate = stats?.webhookSuccessRates?.find(
    (rate) => rate.webhookId === webhook.id
  )?.rate || 100;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold text-gray-900">{webhook.name}</h2>
          {webhook.enabled ? (
            <span className="ml-3 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              Active
            </span>
          ) : (
            <span className="ml-3 px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
              Inactive
            </span>
          )}
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the webhook "{webhook.name}" and all associated event data.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-md mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Success Rate</p>
                      <p className={`text-lg font-semibold ${
                        successRate >= 95 ? "text-green-600" : 
                        successRate >= 80 ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {successRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {webhook.createdAt ? new Date(webhook.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Endpoint</p>
                      <p className="text-sm font-mono truncate text-gray-900">
                        {webhook.url}
                      </p>
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Webhook Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endpoint URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HTTP Method</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(HttpMethod).map((method) => (
                              <SelectItem key={method} value={method}>
                                {method}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="retryLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retry Limit</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              max={10} 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum number of retry attempts (0-10)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="retryInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retry Interval (seconds)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={5} 
                              max={3600} 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Time between retry attempts (5-3600 seconds)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>
                            Enable or disable webhook delivery
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 w-full"
                    disabled={updateWebhook.isPending}
                  >
                    {updateWebhook.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event History</CardTitle>
            </CardHeader>
            <CardContent>
              <EventLogTable webhookId={id} showPagination={true} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="testing">
          <Card>
            <CardHeader>
              <CardTitle>Test Webhook</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mb-6">
                Test your webhook endpoint by sending a sample payload.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Sample Payload</h3>
                  <div className="bg-gray-50 p-4 rounded-md font-mono text-sm overflow-auto max-h-80">
                    <pre>{JSON.stringify({
                      id: "evt_sample123456",
                      type: "test.event",
                      created_at: new Date().toISOString(),
                      data: {
                        message: "This is a test event",
                        timestamp: Date.now(),
                      }
                    }, null, 2)}</pre>
                  </div>
                </div>
                
                <Button className="bg-primary-600 hover:bg-primary-700">
                  Send Test Webhook
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
