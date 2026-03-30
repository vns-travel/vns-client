import { Route, Routes } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import LoginPartner from "./pages/PartnerPages/LoginPartner";
import RegisterPartner from "./pages/PartnerPages/RegisterPartner";
import ForgotPassword from "./pages/PartnerPages/ForgotPassword";
import PartnerService from "./pages/PartnerPages/PartnerService";
import PartnerFinance from "./pages/PartnerPages/PartnerFinance";
import PartnerBooking from "./pages/PartnerPages/PartnerBooking";
import PartnerDashboard from "./pages/PartnerPages/PartnerDashboard";
import PartnerProfile from "./pages/PartnerPages/PartnerProfile";
import PartnerMessaging from "./pages/PartnerPages/PartnerMessaging";
import PartnerLayout from "./pages/PartnerPages/PartnerLayout";
import PartnerServiceRegistration from "./pages/PartnerPages/PartnerServiceRegistration";
import PartnerServiceDetails from "./pages/PartnerPages/PartnerServiceDetails";
import PartnerBookingDetails from "./pages/PartnerPages/PartnerBookingDetails";
import ManagerAccountManagement from "./pages/ManagerPages/ManagerAccountManagement";
import ManagerDashboard from "./pages/ManagerPages/ManagerDashboard";
import ManagerLayout from "./pages/ManagerPages/ManagerLayout";
import PartnerCombo from "./pages/PartnerPages/PartnerCombo";
import PartnerComboCreate from "./pages/PartnerPages/PartnerComboCreate";
import ManagerPromotion from "./pages/ManagerPages/ManagerPromotion";
import ManagerPromotionCreate from "./pages/ManagerPages/ManagerPromotionCreate";
import ManagerPromotionDetails from "./pages/ManagerPages/ManagerPromotionDetails";
import ManagerServiceApproval from "./pages/ManagerPages/ManagerServiceApproval";
import ManagerDocumentReview from "./pages/ManagerPages/ManagerDocumentReview";
import ManagerFinance from "./pages/ManagerPages/ManagerFinance";
import ManagerFeedback from "./pages/ManagerPages/ManagerFeedback";
import ManagerRefund from "./pages/ManagerPages/ManagerRefund";
import AdminLayout from "./pages/AdminPages/AdminLayout";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import AdminUserManagement from "./pages/AdminPages/AdminUserManagement";
import DestinationsExplorer from "./pages/DestinationsExplorer";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPartner />} />
        <Route path="/LoginPartner" element={<LoginPartner />} />
        <Route path="/RegisterPartner" element={<RegisterPartner />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/destinations" element={<DestinationsExplorer />} />

        {/* Manager routes */}
        <Route element={<ManagerLayout />}>
          <Route path="/ManagerDashboard" element={<ManagerDashboard />} />
          <Route
            path="/ManagerAccountManagement"
            element={<ManagerAccountManagement />}
          />
          <Route path="/ManagerPromotion" element={<ManagerPromotion />} />
          <Route
            path="/ManagerPromotion/create"
            element={<ManagerPromotionCreate />}
          />
          <Route
            path="/ManagerPromotion/detail"
            element={<ManagerPromotionDetails />}
          />
          <Route
            path="/ManagerPromotion/edit"
            element={<ManagerPromotionDetails />}
          />
          <Route
            path="/ManagerServiceApproval"
            element={<ManagerServiceApproval />}
          />
          <Route
            path="/ManagerDocumentReview"
            element={<ManagerDocumentReview />}
          />
          <Route path="/ManagerFinance" element={<ManagerFinance />} />
          <Route path="/ManagerFeedback" element={<ManagerFeedback />} />
          <Route path="/ManagerRefund" element={<ManagerRefund />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route
            path="/AdminUserManagement"
            element={<AdminUserManagement />}
          />
        </Route>

        {/* Partner routes */}
        <Route element={<PartnerLayout />}>
          <Route path="/PartnerDashboard" element={<PartnerDashboard />} />
          <Route path="/PartnerService" element={<PartnerService />} />
          <Route
            path="/PartnerService/register"
            element={<PartnerServiceRegistration />}
          />
          <Route
            path="/PartnerService/detail"
            element={<PartnerServiceDetails />}
          />
          <Route path="/PartnerFinance" element={<PartnerFinance />} />
          <Route path="/PartnerBooking" element={<PartnerBooking />} />
          <Route
            path="/PartnerBookingDetails"
            element={<PartnerBookingDetails />}
          />
          <Route path="/PartnerProfile" element={<PartnerProfile />} />
          <Route path="/PartnerCombo" element={<PartnerCombo />} />
          <Route path="/PartnerCombo/create" element={<PartnerComboCreate />} />
          <Route path="/PartnerMessaging" element={<PartnerMessaging />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
