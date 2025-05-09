
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Deals from "./pages/Deals";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { gsap } from "gsap";

// Initialize GSAP plugins
gsap.registerEffect({
  name: "fadeIn",
  effect: (targets: gsap.TweenTarget, config: any) => {
    return gsap.fromTo(
      targets,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: config.duration || 0.5,
        ease: config.ease || "power2.out",
        stagger: config.stagger || 0.1
      }
    );
  },
  defaults: { duration: 0.5 }
});

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Add any global GSAP initialization or setup here
    document.title = "CRM Dashboard";
  }, []);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
