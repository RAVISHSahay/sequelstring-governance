import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ActivityLogProvider } from "@/contexts/ActivityLogContext";
import { TourOverlay } from "@/components/onboarding/TourOverlay";
import { CommandPalette } from "@/components/command/CommandPalette";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Auth from "./pages/Auth";
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
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <OnboardingProvider>
              <NotificationProvider>
                <ActivityLogProvider>
                  <Toaster />
                  <Sonner />
                  <TourOverlay />
                  <CommandPalette />
                  <Routes>
                    {/* Public route */}
                    <Route path="/auth" element={<Auth />} />
                    
                    {/* Protected routes */}
                    <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                    <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
                    <Route path="/account-map" element={<ProtectedRoute><AccountMap /></ProtectedRoute>} />
                    <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
                    <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
                    <Route path="/opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
                    <Route path="/quotes" element={<ProtectedRoute><Quotes /></ProtectedRoute>} />
                    <Route path="/quotes/new" element={<ProtectedRoute><QuoteBuilder /></ProtectedRoute>} />
                    <Route path="/contracts" element={<ProtectedRoute><Contracts /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                    <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                    <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    
                    {/* Intelligence Routes */}
                    <Route path="/forecasting" element={<ProtectedRoute><Forecasting /></ProtectedRoute>} />
                    <Route path="/win-loss" element={<ProtectedRoute><WinLossAnalysis /></ProtectedRoute>} />
                    <Route path="/poc-tracking" element={<ProtectedRoute><POCTracking /></ProtectedRoute>} />
                    <Route
                      path="/sales-stages"
                      element={
                        <ProtectedRoute requiredPermissions={['view_admin']}>
                          <SalesStageConfig />
                        </ProtectedRoute>
                      }
                    />
                    
                    {/* Incentive Engine Routes */}
                    <Route path="/targets" element={<ProtectedRoute><Targets /></ProtectedRoute>} />
                    <Route path="/incentives" element={<ProtectedRoute><Incentives /></ProtectedRoute>} />
                    <Route path="/payouts" element={<ProtectedRoute><Payouts /></ProtectedRoute>} />
                    <Route path="/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
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
                    <Route path="/user-guide" element={<ProtectedRoute><UserGuide /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ActivityLogProvider>
              </NotificationProvider>
            </OnboardingProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
