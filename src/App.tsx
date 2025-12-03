
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import SuperAdmin from "./pages/SuperAdmin";
import UsersManagement from "./pages/UsersManagement";
import CreateUser from "./pages/CreateUser";
import Profile from "./pages/Profile";
import AdditionalPage from "./pages/AdditionalPage";
import StoragePage from "./pages/StoragePage";
import FolderViewPage from "./pages/FolderViewPage";
import PabRegistrationPage from "./pages/PabRegistrationPage";
import PabDictionariesPage from "./pages/PabDictionariesPage";
import OrganizationsManagementPage from "./pages/OrganizationsManagementPage";
import CreateOrganizationPage from "./pages/CreateOrganizationPage";
import OrganizationSettingsPage from "./pages/OrganizationSettingsPage";
import OrganizationUsersPage from "./pages/OrganizationUsersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/superadmin" element={<SuperAdmin />} />
          <Route path="/users-management" element={<UsersManagement />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/additional" element={<AdditionalPage />} />
          <Route path="/storage" element={<StoragePage />} />
          <Route path="/storage/folder/:folderId" element={<FolderViewPage />} />
          <Route path="/pab-registration" element={<PabRegistrationPage />} />
          <Route path="/pab-dictionaries" element={<PabDictionariesPage />} />
          <Route path="/organizations-management" element={<OrganizationsManagementPage />} />
          <Route path="/create-organization" element={<CreateOrganizationPage />} />
          <Route path="/organization-settings/:id" element={<OrganizationSettingsPage />} />
          <Route path="/organization-users/:id" element={<OrganizationUsersPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;