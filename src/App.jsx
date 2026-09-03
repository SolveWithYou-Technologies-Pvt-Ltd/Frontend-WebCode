import { useEffect } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";

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
import ApplyJob from "./components/career/ApplyJob.jsx";
import Myproposals from './pages/MyProposals.jsx'

import { AdminAuthProvider } from "./admin/context/AdminAuthContext";
import AdminLayout from "./admin/layout/AdminLayout";
import AdminProtectedRoute from "./admin/routes/AdminProtectedRoute";

import AddAdminPage from "./admin/pages/AddAdminPage";
import AddEmployeePage from "./admin/pages/AddEmployeePage";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import AdminPermissionsPage from "./admin/pages/AdminPermissionsPage";
import AdminProfilePage from "./admin/pages/AdminProfilePage";
import AdminsPage from "./admin/pages/AdminsPage";
import EditAdminPage from "./admin/pages/EditAdminPage";
import EditAdminProfilePage from "./admin/pages/EditAdminProfilePage";
import EditEmployeePage from "./admin/pages/EditEmployeePage";
import EmployeePermissionsPage from "./admin/pages/EmployeePermissionsPage";
import EmployeesPage from "./admin/pages/EmployeesPage";
import SuperAdminRegisterPage from "./admin/pages/SuperAdminRegisterPage";
import ViewAdminPage from "./admin/pages/ViewAdminPage";
import ViewEmployeePage from "./admin/pages/ViewEmployeePage";
import ViewTeamPage from "./admin/pages/ViewTeamPage";
import Clients from "./admin/pages/Clients.jsx";
import ClientForm from "./admin/components/CleintComponents/ClientForm.jsx";
import ClientView from "./admin/components/CleintComponents/ClientView.jsx";
import HR from "./admin/pages/HR.jsx";
import Hiring from "./admin/components/HR/Hiring.jsx";
import JobForm from "./admin/components/HR/JobForm.jsx";
import JobView from "./admin/components/HR/JobView.jsx";
import AppliedCandidates from "./admin/components/HR/AppliedCandidates.jsx";
import ApplicationView from "./admin/components/HR/ApplicationView.jsx";

import OurServices from "./admin/pages/OurServices.jsx";
import ServiceForm from "./admin/components/Services/ServiceForm.jsx";
import ServiceView from "./admin/components/Services/ServiceView.jsx";
import ClientQoutes from "./admin/pages/ClientQoutes.jsx";
import QuoteView from "./admin/components/Quotes/QuoteView.jsx";
import QuoteEdit from "./admin/components/Quotes/QuoteEdit";
import AdminQuoteCreate from './admin/components/Quotes/AdminQuoteCreate.jsx';

import Proposals from "./admin/pages/QoutesProposals.jsx";
import AdminProposalView from "./admin/components/Proposal/AdminProposalView.jsx";
import ProposalEdit from "./admin/components/Proposal/ProposalEdit.jsx";
import ClientProjects from "./admin/pages/ClientsProjects.jsx";
import ClientProjectCreate from "./admin/components/ClientProjects/ClientProjectCreate.jsx";
import ClientProjectEdit from "./admin/components/ClientProjects/ClientProjectEdit.jsx";
import ClientProjectView from "./admin/components/ClientProjects/ClientProjectView.jsx";
import WebsiteAndContent from './admin/pages/WebsiteAndContent.jsx';
import SalesandMarketing from './admin/pages/SalesandMarketing.jsx';
import SupportTickets from "./admin/pages/SupportTickets.jsx";
import SupportTicketView from "./admin/components/Support/SupportTicketView.jsx";
import SupportTicketEdit from "./admin/components/Support/SupportTicketEdit.jsx";

import AccountsAndBillings from "./admin/pages/AccountsAndBillings.jsx";
import TransactionForm from "./admin/components/Accounts/TransactionForm.jsx";
import TransactionView from "./admin/components/Accounts/TransactionView.jsx";
import TransactionEdit from "./admin/components/Accounts/TransactionEdit.jsx";

const AdminAuthRoutes = () => {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
};

const App = () => {
  return (
    <HelmetProvider>
      <Helmet
        titleTemplate="%s | SolveWithYou Pvt Ltd"
        defaultTitle="SolveWithYou Pvt Ltd | Custom Web & App Development"
      >
        <meta name="description" content="SolveWithYou provides custom website and mobile app development, maintenance, and upgradation services. We can create solutions together." />
      </Helmet>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/apply/:id" element={<ApplyJob />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/support" element={<Support />} />
            <Route path="/myproposals" element={<Myproposals />} />
            <Route path="/proposal/:id" element={<ProposalView />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
          </Route>
        </Route>

        <Route element={<AdminAuthRoutes />}>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/register-superadmin" element={<SuperAdminRegisterPage />} />

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
                <Route path="admins/:id/permissions" element={<AdminPermissionsPage />} />
              </Route>

              <Route element={<AdminProtectedRoute moduleName="employees" action="view" />}>
                <Route path="employees" element={<EmployeesPage />} />
                <Route path="employees/:id" element={<ViewEmployeePage />} />
              </Route>

              <Route element={<AdminProtectedRoute moduleName="employees" action="create" />}>
                <Route path="employees/add" element={<AddEmployeePage />} />
              </Route>

              <Route element={<AdminProtectedRoute moduleName="employees" action="edit" />}>
                <Route path="employees/:id/edit" element={<EditEmployeePage />} />
                <Route path="employees/:id/permissions" element={<EmployeePermissionsPage />} />
              </Route>

              <Route element={<AdminProtectedRoute moduleName="services" action="view" />}>
                <Route path="services" element={<OurServices />} />
                <Route path="services/:id" element={<ServiceView />} />
              </Route>

              <Route element={<AdminProtectedRoute moduleName="services" action="create" />}>
                <Route path="services/add" element={<ServiceForm />} />
              </Route>

              <Route element={<AdminProtectedRoute moduleName="services" action="edit" />}>
                <Route path="services/edit/:id" element={<ServiceForm />} />
              </Route>

              <Route element={<AdminProtectedRoute moduleName="clients" action="view" />}>
                <Route path="clients" element={<Clients />} />
                <Route path="clients/:id" element={<ClientView />} />
              </Route>

              <Route element={<AdminProtectedRoute moduleName="clients" action="edit" />}>
                <Route path="clients/:id/edit" element={<ClientForm />} />
              </Route>

              <Route element={<AdminProtectedRoute moduleName="clients" action="create" />}>
                <Route path="clients/add" element={<ClientForm />} />
              </Route>

              <Route path="hr" element={<HR />} />
              <Route path="hr/hiring" element={<Hiring />} />
              <Route path="hiring/add" element={<JobForm />} />
              <Route path="hiring/edit/:id" element={<JobForm />} />
              <Route path="hiring/view/:id" element={<JobView />} />
              <Route path="hiring/applied-candidates" element={<AppliedCandidates />} />
              <Route path="hr/applicants/:id" element={<ApplicationView />} />

              <Route path="quotes" element={<ClientQoutes />} />
              <Route path="quotes/:id" element={<QuoteView />} />
              <Route path="quotes/edit/:id" element={<QuoteEdit />} />
              <Route path="quotes/add" element={<AdminQuoteCreate />} />

              <Route path="proposals" element={<Proposals />} />
              <Route path="proposals/:id" element={<AdminProposalView />} />
              <Route path="proposals/edit/:id" element={<ProposalEdit />} />
              <Route path="clientprojects" element={<ClientProjects />} />
              <Route path="clientprojects/create/:proposalId" element={<ClientProjectCreate />} />
              <Route path="clientprojects/edit/:id" element={<ClientProjectEdit />} />
              <Route path="clientprojects/:id" element={<ClientProjectView />} />
              <Route path="contentmanagementsystem" element={<WebsiteAndContent />} />
              <Route path="sales" element={<SalesandMarketing />} />
              <Route path="accounts" element={<AccountsAndBillings />} />
              <Route path="accounts/add" element={<TransactionForm />} />
              <Route path="accounts/:id" element={<TransactionView />} />
              <Route path="accounts/edit/:id" element={<TransactionEdit />} />
              <Route path="tickets" element={<SupportTickets />} />
              <Route path="tickets/:id" element={<SupportTicketView />} />
              <Route path="tickets/edit/:id" element={<SupportTicketEdit />} />

            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </HelmetProvider>
  );
};

export default App;