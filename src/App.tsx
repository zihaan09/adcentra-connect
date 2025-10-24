import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./layouts/DashboardLayout";
import AdvertiserDashboard from "./pages/advertiser/AdvertiserDashboard";
import AdvertiserScreens from "./pages/advertiser/AdvertiserScreens";
import AdvertiserCampaigns from "./pages/advertiser/AdvertiserCampaigns";
import AdvertiserSupport from "./pages/advertiser/AdvertiserSupport";
import AdvertiserProfile from "./pages/advertiser/AdvertiserProfile";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerScreens from "./pages/owner/OwnerScreens";
import OwnerRequests from "./pages/owner/OwnerRequests";
import OwnerCampaigns from "./pages/owner/OwnerCampaigns";
import OwnerSupport from "./pages/owner/OwnerSupport";
import OwnerProfile from "./pages/owner/OwnerProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Advertiser Routes */}
          <Route path="/advertiser" element={<DashboardLayout role="advertiser"><AdvertiserDashboard /></DashboardLayout>} />
          <Route path="/advertiser/screens" element={<DashboardLayout role="advertiser"><AdvertiserScreens /></DashboardLayout>} />
          <Route path="/advertiser/campaigns" element={<DashboardLayout role="advertiser"><AdvertiserCampaigns /></DashboardLayout>} />
          <Route path="/advertiser/support" element={<DashboardLayout role="advertiser"><AdvertiserSupport /></DashboardLayout>} />
          <Route path="/advertiser/profile" element={<DashboardLayout role="advertiser"><AdvertiserProfile /></DashboardLayout>} />
          
          {/* Media Owner Routes */}
          <Route path="/owner" element={<DashboardLayout role="owner"><OwnerDashboard /></DashboardLayout>} />
          <Route path="/owner/screens" element={<DashboardLayout role="owner"><OwnerScreens /></DashboardLayout>} />
          <Route path="/owner/requests" element={<DashboardLayout role="owner"><OwnerRequests /></DashboardLayout>} />
          <Route path="/owner/campaigns" element={<DashboardLayout role="owner"><OwnerCampaigns /></DashboardLayout>} />
          <Route path="/owner/support" element={<DashboardLayout role="owner"><OwnerSupport /></DashboardLayout>} />
          <Route path="/owner/profile" element={<DashboardLayout role="owner"><OwnerProfile /></DashboardLayout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
