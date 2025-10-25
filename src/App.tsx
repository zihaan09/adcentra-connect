import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { useAuthStore } from "./store";
import { seedAllData } from "./lib/seedData";
import { 
  useRFPStore, 
  useProposalStore, 
  useHoldStore, 
  useCampaignStore, 
  useScreenStore, 
  useNotificationStore, 
  useSupportTicketStore, 
  useChatStore 
} from "./store";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'advertiser' | 'owner' }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const { user } = useAuthStore();
  
  // Initialize stores with seed data on first load
  useEffect(() => {
    try {
      console.log('Initializing stores...');
      const seedData = seedAllData();
      console.log('Seed data generated:', seedData);
      
      // Only seed if stores are empty (first time load)
      const rfpStore = useRFPStore.getState();
      console.log('Current RFP store state:', rfpStore);
      
      if (rfpStore.rfps.length === 0) {
        console.log('Seeding stores with sample data...');
        // Seed all stores with sample data
        useRFPStore.setState({ rfps: seedData.rfps });
        useProposalStore.setState({ proposals: seedData.proposals });
        useHoldStore.setState({ holds: seedData.holds });
        useCampaignStore.setState({ campaigns: seedData.campaigns });
        useScreenStore.setState({ screens: seedData.screens });
        useNotificationStore.setState({ notifications: seedData.notifications });
        useSupportTicketStore.setState({ tickets: seedData.supportTickets });
        useChatStore.setState({ messages: seedData.chatMessages });
        console.log('Stores seeded successfully');
      } else {
        console.log('Stores already have data, skipping seed');
      }
    } catch (error) {
      console.error('Error initializing stores:', error);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Advertiser Routes */}
            <Route 
              path="/advertiser" 
              element={
                <ProtectedRoute requiredRole="advertiser">
                  <DashboardLayout role="advertiser">
                    <AdvertiserDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/advertiser/screens" 
              element={
                <ProtectedRoute requiredRole="advertiser">
                  <DashboardLayout role="advertiser">
                    <AdvertiserScreens />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/advertiser/campaigns" 
              element={
                <ProtectedRoute requiredRole="advertiser">
                  <DashboardLayout role="advertiser">
                    <AdvertiserCampaigns />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/advertiser/support" 
              element={
                <ProtectedRoute requiredRole="advertiser">
                  <DashboardLayout role="advertiser">
                    <AdvertiserSupport />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/advertiser/profile" 
              element={
                <ProtectedRoute requiredRole="advertiser">
                  <DashboardLayout role="advertiser">
                    <AdvertiserProfile />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* Media Owner Routes */}
            <Route 
              path="/owner" 
              element={
                <ProtectedRoute requiredRole="owner">
                  <DashboardLayout role="owner">
                    <OwnerDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner/screens" 
              element={
                <ProtectedRoute requiredRole="owner">
                  <DashboardLayout role="owner">
                    <OwnerScreens />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner/requests" 
              element={
                <ProtectedRoute requiredRole="owner">
                  <DashboardLayout role="owner">
                    <OwnerRequests />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner/campaigns" 
              element={
                <ProtectedRoute requiredRole="owner">
                  <DashboardLayout role="owner">
                    <OwnerCampaigns />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner/support" 
              element={
                <ProtectedRoute requiredRole="owner">
                  <DashboardLayout role="owner">
                    <OwnerSupport />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/owner/profile" 
              element={
                <ProtectedRoute requiredRole="owner">
                  <DashboardLayout role="owner">
                    <OwnerProfile />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
