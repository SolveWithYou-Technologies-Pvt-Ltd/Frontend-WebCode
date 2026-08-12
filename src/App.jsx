import { useEffect } from "react";
import { Outlet, Route, Routes } from "react-router-dom";

// User Pages
import UserLayout from "./components/layout/UserLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Portfolio from "./pages/Portfolio";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import Quotes from "./pages/Quotes";
import ProposalView from "./pages/ProposalView";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardOverview from "./pages/DashboardOverview";
import Careers from "./pages/Careers";

// Admin Context, Layout and Routes
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";
import AdminLayout from "./admin/layout/AdminLayout";
import AdminProtectedRoute from "./admin/routes/AdminProtectedRoute";

// Admin Pages
import AddAdminPage from "./admin/pages/AddAdminPage";
import AddEmployeePage from "./admin/pages/AddEmployeePage";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import AdminPermissionsPage from "./admin/pages/AdminPermissionsPage";
import AdminProfilePage from "./admin/pages/AdminProfilePage";
import AdminsPage from "./admin/pages/AdminsPage";
import CreateServicePage from "./admin/pages/CreateServicePage";
import EditAdminPage from "./admin/pages/EditAdminPage";
import EditAdminProfilePage from "./admin/pages/EditAdminProfilePage";
import EditEmployeePage from "./admin/pages/EditEmployeePage";
import EditServicePage from "./admin/pages/EditServicePage";
import EmployeePermissionsPage from "./admin/pages/EmployeePermissionsPage";
import EmployeesPage from "./admin/pages/EmployeesPage";
import Serviceslist from "./admin/pages/Serviceslist";
import SuperAdminRegisterPage from "./admin/pages/SuperAdminRegisterPage";
import ViewAdminPage from "./admin/pages/ViewAdminPage";
import ViewEmployeePage from "./admin/pages/ViewEmployeePage";
import ViewServicePage from "./admin/pages/ViewServicePage";
import ViewTeamPage from "./admin/pages/ViewTeamPage";
import Clients from "./admin/pages/Clients.jsx";
import ClientForm from "./admin/components/CleintComponents/ClientForm.jsx";
import ClientView from "./admin/components/CleintComponents/ClientView.jsx";
import HR from "./admin/pages/HR.jsx";
import Hiring from "./admin/components/HR/Hiring.jsx";



const USER_LOCATION_STORAGE_KEY = "doctor-app-current-location";
let locationRequestStarted = false;

const AdminAuthRoutes = () => {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
};

const DoctorAuthRoutes = () => {
  return (
    <DoctorAuthProvider>
      <Outlet />
    </DoctorAuthProvider>
  );
};

const saveCurrentLocation = (coords) => {
  const location = {
    latitude: coords.latitude,
    longitude: coords.longitude,
    accuracy: coords.accuracy,
    capturedAt: Date.now(),
  };

  sessionStorage.setItem(USER_LOCATION_STORAGE_KEY, JSON.stringify(location));

  window.dispatchEvent(
    new CustomEvent("user-location-updated", {
      detail: location,
    }),
  );
};

const LocationAccessManager = () => {
  useEffect(() => {
    const savedLocation = sessionStorage.getItem(USER_LOCATION_STORAGE_KEY);

    if (savedLocation || locationRequestStarted || !navigator.geolocation) {
      return;
    }

    locationRequestStarted = true;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => saveCurrentLocation(coords),
      () => {
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000,
      },
    );
  }, []);

  return null;
};

const UserLocationRoutes = () => {
  return (
    <>
      <LocationAccessManager />
      <UserLayout />
    </>
  );
};

const App = () => {
  return (
    <Routes>
      <Route element={<UserLocationRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quotes" element={<Quotes />} />
          <Route path="/support" element={<Support />} />
          <Route path="/proposal/:id" element={<ProposalView />} />
          <Route path="/projects" element={<Projects />} /> 
          <Route path="/project/:id" element={<ProjectDetails />} />
      
      </Route>
      <Route element={<AdminAuthRoutes />}>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/register-superadmin"
          element={<SuperAdminRegisterPage />}
        />

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="team" element={<ViewTeamPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="profile/edit" element={<EditAdminProfilePage />} />
            <Route element={<AdminProtectedRoute roles={["superadmin"]} />}>
              <Route path="admins" element={<AdminsPage />} />
              <Route path="admins/add" element={<AddAdminPage />} />
              <Route path="admins/:id" element={<ViewAdminPage />} />
              <Route path="admins/:id/edit" element={<EditAdminPage />} />
              <Route
                path="admins/:id/permissions"
                element={<AdminPermissionsPage />}
              />
            </Route> 
            <Route element={ <AdminProtectedRoute moduleName="employees" action="view" /> }>
              <Route path="employees" element={<EmployeesPage />} />
              <Route path="employees/:id" element={<ViewEmployeePage />} />
            </Route>
            <Route
              element={
                <AdminProtectedRoute moduleName="employees" action="create" />
              }
            >
              <Route path="employees/add" element={<AddEmployeePage />} />
            </Route>

            {/* Employee Edit Routes */}
            <Route
              element={
                <AdminProtectedRoute moduleName="employees" action="edit" />
              }
            >
              <Route path="employees/:id/edit" element={<EditEmployeePage />} />
              <Route
                path="employees/:id/permissions"
                element={<EmployeePermissionsPage />}
              />
            </Route>

            {/* Service View Routes */}
            <Route
              element={
                <AdminProtectedRoute moduleName="services" action="view" />
              }
            >
              <Route path="services" element={<Serviceslist />} />
              <Route path="services/:id" element={<ViewServicePage />} />
            </Route>

            {/* Service Create Routes */}
            <Route
              element={
                <AdminProtectedRoute moduleName="services" action="create" />
              }
            >
              <Route path="services/create" element={<CreateServicePage />} />
            </Route>

            {/* Service Edit Routes */}
            <Route
              element={
                <AdminProtectedRoute moduleName="services" action="edit" />
              }
            >
              <Route path="services/:id/edit" element={<EditServicePage />} />
            </Route>

            <Route
              element={
                <AdminProtectedRoute moduleName="clients" action="view" />
              }
            >
              <Route path="clients" element={<Clients />} />
              <Route path="clients/:id" element={<ClientView />} />
            </Route>
            <Route
              element={
                <AdminProtectedRoute moduleName="clients" action="edit" />
              }
            >
              <Route path="clients/:id/edit" element={<ClientForm />} />
            </Route>
            <Route
              element={
                <AdminProtectedRoute moduleName="clients" action="create" />
              }
            >
                <Route path="clients/add" element={<ClientForm />} />
            </Route>
            <Route path="hr" element={<HR />} />
            <Route path="hr/hiring" element={<Hiring />} />
      
          </Route>
         
          <Route>
        
      </Route>
        </Route>
      </Route>

      

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
