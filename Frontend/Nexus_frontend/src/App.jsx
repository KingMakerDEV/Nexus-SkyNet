import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import UploadData from "./pages/UploadData";
import DatasetExplorer from "./pages/DatasetExplorer";
import CompareDatasets from "./pages/CompareDatasets";
import Analytics from "./pages/Analytics";
import AIDiscovery from "./pages/AIDiscovery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout wrapper that conditionally shows navbar/sidebar
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (isHomePage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background star-field">
      {/* Ambient background effects */}
      <div className="fixed inset-0 bg-cosmic-radial pointer-events-none" />
      <div className="fixed inset-0 bg-nebula-gradient pointer-events-none opacity-50" />
      
      <Navbar />
      <Sidebar />
      
      {/* Main content area */}
      <main className="pl-64 pt-16 min-h-screen transition-all duration-300">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadData />} />
            <Route path="/datasets" element={<DatasetExplorer />} />
            <Route path="/compare" element={<CompareDatasets />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ai-discovery" element={<AIDiscovery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
