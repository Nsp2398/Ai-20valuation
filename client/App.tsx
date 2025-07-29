import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Index from "./pages/Index";
import Valuation from "./pages/Valuation";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/valuation" element={<Valuation />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/methods"
              element={
                <PlaceholderPage
                  title="Valuation Methods"
                  description="Learn about our comprehensive valuation methodologies including Berkus, Scorecard, VC Method, DCF, and more."
                />
              }
            />
            <Route
              path="/pricing"
              element={
                <PlaceholderPage
                  title="Pricing Plans"
                  description="Choose the plan that fits your needs. From free basic valuations to premium enterprise solutions."
                />
              }
            />
            <Route
              path="/about"
              element={
                <PlaceholderPage
                  title="About ValuAI"
                  description="Learn about our mission to democratize business valuation with AI-powered tools and expert methodologies."
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <PlaceholderPage
                  title="Dashboard"
                  description="View your valuation history, download reports, and track your business growth over time."
                />
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
