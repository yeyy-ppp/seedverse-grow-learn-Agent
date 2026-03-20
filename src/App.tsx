import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SeedVerseProvider } from "@/contexts/SeedVerseContext";
import BottomNav from "@/components/BottomNav";
import HomePage from "./pages/HomePage";
import IdentifyPage from "./pages/IdentifyPage";
import GardenPage from "./pages/GardenPage";
import GamesPage from "./pages/GamesPage";
import ProfilePage from "./pages/ProfilePage";
import PlantDetailPage from "./pages/PlantDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SeedVerseProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="max-w-lg mx-auto relative">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/identify" element={<IdentifyPage />} />
              <Route path="/garden" element={<GardenPage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/plant/:id" element={<PlantDetailPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </SeedVerseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
