import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Webhooks from "@/pages/webhooks";
import EventLogs from "@/pages/event-logs";
import CreateWebhook from "@/pages/create-webhook";
import WebhookDetail from "@/pages/webhook-detail";
import Settings from "@/pages/settings";
import ApiDocs from "@/pages/api-docs";
import AppLayout from "@/components/layout/app-layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/webhooks" component={Webhooks} />
      <Route path="/webhooks/create" component={CreateWebhook} />
      <Route path="/webhooks/:id" component={WebhookDetail} />
      <Route path="/events" component={EventLogs} />
      <Route path="/settings" component={Settings} />
      <Route path="/api-docs" component={ApiDocs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppLayout>
          <Router />
        </AppLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
