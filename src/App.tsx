import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import HomePage from './pages/HomePage';
import BusinessDirectoryPage from './pages/BusinessDirectoryPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AuthProvider } from './contexts/AuthContext';
import ProfilePage from './pages/ProfilePage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import QRScannerPage from './pages/QRScannerPage';
import LoyaltyPage from './pages/LoyaltyPage';
import SalesAgentSignup from './pages/SalesAgentSignup';
import SalesAgentDashboard from './pages/SalesAgentDashboard';
import BusinessSignupPage from './pages/BusinessSignupPage';
import CustomerSignupPage from './pages/CustomerSignupPage';
import SignupSuccessPage from './pages/SignupSuccessPage';
import RequireAuth from './components/auth/RequireAuth';
import RequireBusiness from './components/auth/RequireBusiness';
import RequireCustomer from './components/auth/RequireCustomer';
import RequireSalesAgent from './components/auth/RequireSalesAgent';
import BusinessDashboard from './pages/BusinessDashboard';
import LoyaltyHistoryPage from './pages/LoyaltyHistoryPage';
import QRCodeGeneratorPage from './pages/QRCodeGeneratorPage';
import QRCodeScannerV2Page from './pages/QRCodeScannerV2Page';
import ReferralPage from './pages/ReferralPage';

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
    element: <RequireAuth><SalesAgentSignup /></RequireAuth>,
  },
  {
    path: "/agent-dashboard",
    element: <RequireSalesAgent><SalesAgentDashboard /></RequireSalesAgent>,
  },
  {
    path: "/business-dashboard",
    element: <RequireBusiness><BusinessDashboard /></RequireBusiness>,
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
