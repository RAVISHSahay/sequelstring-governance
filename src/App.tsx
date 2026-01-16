import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ActivityLogProvider } from "@/contexts/ActivityLogContext";
import { TourOverlay } from "@/components/onboarding/TourOverlay";
import { CommandPalette } from "@/components/command/CommandPalette";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Accounts from "./pages/Accounts";
import AccountMap from "./pages/AccountMap";
import Contacts from "./pages/Contacts";
import Opportunities from "./pages/Opportunities";
import Leads from "./pages/Leads";
import Quotes from "./pages/Quotes";
import QuoteBuilder from "./pages/QuoteBuilder";
import Contracts from "./pages/Contracts";
import Orders from "./pages/Orders";
import Activities from "./pages/Activities";
import Reports from "./pages/Reports";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import Targets from "./pages/Targets";
import Incentives from "./pages/Incentives";
import Payouts from "./pages/Payouts";
import Performance from "./pages/Performance";
import AdminControls from "./pages/AdminControls";
import UserManagement from "./pages/UserManagement";
import SalesStageConfig from "./pages/SalesStageConfig";
import Forecasting from "./pages/Forecasting";
import WinLossAnalysis from "./pages/WinLossAnalysis";
import POCTracking from "./pages/POCTracking";
import UserGuide from "./pages/UserGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <OnboardingProvider>
          <NotificationProvider>
            <ActivityLogProvider>
              <Toaster />
              <Sonner />
              <TourOverlay />
              <BrowserRouter>
                <CommandPalette />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/accounts" element={<Accounts />} />
                  <Route path="/account-map" element={<AccountMap />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/leads" element={<Leads />} />
                  <Route path="/opportunities" element={<Opportunities />} />
                  <Route path="/quotes" element={<Quotes />} />
                  <Route path="/quotes/new" element={<QuoteBuilder />} />
                  <Route path="/contracts" element={<Contracts />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/activities" element={<Activities />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* Intelligence Routes */}
                  <Route path="/forecasting" element={<Forecasting />} />
                  <Route path="/win-loss" element={<WinLossAnalysis />} />
                  <Route path="/poc-tracking" element={<POCTracking />} />
                  <Route
                    path="/sales-stages"
                    element={
                      <ProtectedRoute requiredPermissions={['view_admin']}>
                        <SalesStageConfig />
                      </ProtectedRoute>
                    }
                  />
                  {/* Incentive Engine Routes */}
                  <Route path="/targets" element={<Targets />} />
                  <Route path="/incentives" element={<Incentives />} />
                  <Route path="/payouts" element={<Payouts />} />
                  <Route path="/performance" element={<Performance />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredPermissions={['view_admin']}>
                        <AdminControls />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/users"
                    element={
                      <ProtectedRoute requiredPermissions={['manage_users']}>
                        <UserManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/user-guide" element={<UserGuide />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </ActivityLogProvider>
          </NotificationProvider>
        </OnboardingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
