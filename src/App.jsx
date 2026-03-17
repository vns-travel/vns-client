import { Route, Routes } from "react-router-dom";
import "./index.css";
import LoginPartner from "./pages/PartnerPages/LoginPartner";
import PartnerService from "./pages/PartnerPages/PartnerService";
import PartnerFinance from "./pages/PartnerPages/PartnerFinance";
import PartnerBooking from "./pages/PartnerPages/PartnerBooking";
import PartnerDashboard from "./pages/PartnerPages/PartnerDashboard";
import PartnerProfile from "./pages/PartnerPages/PartnerProfile";
import PartnerMessaging from "./pages/PartnerPages/PartnerMessaging";
import PartnerLayout from "./pages/PartnerPages/PartnerLayout";
import PartnerRentalRegistration from "./pages/PartnerPages/PartnerRentalRegistration";
import PartnerTourRegistration from "./pages/PartnerPages/PartnerTourRegistration";
import PartnerCarRentalRegistration from "./pages/PartnerPages/PartnerCarRentalRegistration";
import PartnerBookingDetails from "./pages/PartnerPages/PartnerBookingDetails";
import ManagerAccountManagement from "./pages/ManagerPages/ManagerAccountManagement";
import ManagerDashboard from "./pages/ManagerPages/ManagerDashboard";
import ManagerLayout from "./pages/ManagerPages/ManagerLayout";
import RegisterPartner from "./pages/PartnerPages/RegisterPartner";
import PartnerRentalDetails from "./pages/PartnerPages/PartnerRentalDetails";
import PartnerTourDetails from "./pages/PartnerPages/PartnerTourDetails";
import PartnerCarRentalDetails from "./pages/PartnerPages/PartnerCarRentalDetails";
import PartnerCombo from "./pages/PartnerPages/PartnerCombo";
import PartnerComboCreate from "./pages/PartnerPages/PartnerComboCreate";
import ManagerPromotion from "./pages/ManagerPages/ManagerPromotion";
import ManagerPromotionCreate from "./pages/ManagerPages/ManagerPromotionCreate";
import ManagerPromotionDetails from "./pages/ManagerPages/ManagerPromotionDetails";
import ManagerServiceApproval from "./pages/ManagerPages/ManagerServiceApproval";
import ManagerDocumentReview from "./pages/ManagerPages/ManagerDocumentReview";
import ManagerFinance from "./pages/ManagerPages/ManagerFinance";
import AdminLayout from "./pages/AdminPages/AdminLayout";
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import AdminUserManagement from "./pages/AdminPages/AdminUserManagement";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPartner />} />
        <Route path="/LoginPartner" element={<LoginPartner />} />
        <Route path="/RegisterPartner" element={<RegisterPartner />} />

        {/* Manager routes */}
        <Route element={<ManagerLayout />}>
          <Route path="/ManagerDashboard" element={<ManagerDashboard />} />
          <Route path="/ManagerAccountManagement" element={<ManagerAccountManagement />} />
          <Route path="/ManagerPromotion" element={<ManagerPromotion />} />
          <Route path="/ManagerPromotion/create" element={<ManagerPromotionCreate />} />
          <Route path="/ManagerPromotion/detail" element={<ManagerPromotionDetails />} />
          <Route path="/ManagerPromotion/edit" element={<ManagerPromotionDetails />} />
          <Route path="/ManagerServiceApproval" element={<ManagerServiceApproval />} />
          <Route path="/ManagerDocumentReview" element={<ManagerDocumentReview />} />
          <Route path="/ManagerFinance" element={<ManagerFinance />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/AdminUserManagement" element={<AdminUserManagement />} />
        </Route>

        {/* Partner routes */}
        <Route element={<PartnerLayout />}>
          <Route path="/PartnerDashboard" element={<PartnerDashboard />} />
          <Route path="/PartnerService" element={<PartnerService />} />
          <Route path="/PartnerService/rental" element={<PartnerRentalRegistration />} />
          <Route path="/PartnerService/tour" element={<PartnerTourRegistration />} />
          <Route path="/PartnerService/car" element={<PartnerCarRentalRegistration />} />
          <Route path="/PartnerService/rentalDetail" element={<PartnerRentalDetails />} />
          <Route path="/PartnerService/tourDetail" element={<PartnerTourDetails />} />
          <Route path="/PartnerService/carDetail" element={<PartnerCarRentalDetails />} />
          <Route path="/PartnerFinance" element={<PartnerFinance />} />
          <Route path="/PartnerBooking" element={<PartnerBooking />} />
          <Route path="/PartnerBookingDetails" element={<PartnerBookingDetails />} />
          <Route path="/PartnerProfile" element={<PartnerProfile />} />
          <Route path="/PartnerCombo" element={<PartnerCombo />} />
          <Route path="/PartnerCombo/create" element={<PartnerComboCreate />} />
          <Route path="/PartnerMessaging" element={<PartnerMessaging />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
