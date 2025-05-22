
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import ProfilePage from './pages/ProfilePage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import QRScannerPage from './pages/QRScannerPage';
import LoyaltyPage from './pages/LoyaltyPage';
import LoyaltyHistoryPage from './pages/LoyaltyHistoryPage';
import SignupSuccessPage from './pages/SignupSuccessPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ReferralPage from './pages/ReferralPage';
import HomePage from './pages/HomePage';
import RequireAuth from './components/auth/RequireAuth';
import RequireBusiness from './components/auth/RequireBusiness';
import RequireCustomer from './components/auth/RequireCustomer';
import RequireSalesAgent from './components/auth/RequireSalesAgent';
import BusinessSignupPage from './pages/BusinessSignupPage';
import BusinessDashboardPage from './pages/BusinessDashboardPage';
import BusinessDirectoryPage from './pages/BusinessDirectoryPage';
import CustomerSignupPage from './pages/CustomerSignupPage';
import SalesAgentSignupPage from './pages/SalesAgentSignupPage';
import SalesAgentDashboardPage from './pages/SalesAgentDashboardPage';
import QRCodeGeneratorPage from './pages/QRCodeGeneratorPage';
import QRCodeScannerV2Page from './pages/QRCodeScannerV2Page';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/directory",
    element: <BusinessDirectoryPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/signup-success",
    element: <SignupSuccessPage />,
  },
  {
    path: "/business-signup",
    element: <BusinessSignupPage />,
  },
  {
    path: "/customer-signup",
    element: <CustomerSignupPage />,
  },
  {
    path: "/profile",
    element: <RequireAuth><ProfilePage /></RequireAuth>,
  },
  {
    path: "/business/:id",
    element: <BusinessProfilePage />,
  },
  {
    path: "/scan",
    element: <RequireCustomer><QRScannerPage /></RequireCustomer>,
  },
  {
   path: "/scan-v2",
   element: <RequireCustomer><QRCodeScannerV2Page /></RequireCustomer>,
  },
  {
    path: "/loyalty",
    element: <RequireCustomer><LoyaltyPage /></RequireCustomer>,
  },
  {
    path: "/loyalty-history",
    element: <RequireCustomer><LoyaltyHistoryPage /></RequireCustomer>,
  },
  {
    path: "/become-agent",
    element: <RequireAuth><SalesAgentSignupPage /></RequireAuth>,
  },
  {
    path: "/agent-dashboard",
    element: <RequireSalesAgent><SalesAgentDashboardPage /></RequireSalesAgent>,
  },
  {
    path: "/business-dashboard",
    element: <RequireBusiness><BusinessDashboardPage /></RequireBusiness>,
  },
  {
    path: "/qr-generator",
    element: <RequireBusiness><QRCodeGeneratorPage /></RequireBusiness>,
  },
  {
    path: "/referrals",
    element: <ReferralPage />
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
