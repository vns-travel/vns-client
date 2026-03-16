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
import PartnerPromotion from "./pages/PartnerPages/PartnerPromotion";
import PartnerBookingDetails from "./pages/PartnerPages/PartnerBookingDetails";
import ManagerAccountManagement from "./pages/ManagerPages/ManagerAccountManagement";
import ManagerDashboard from "./pages/ManagerPages/ManagerDashboard";
import ManagerLayout from "./pages/ManagerPages/ManagerLayout";
import RegisterPartner from "./pages/PartnerPages/RegisterPartner";
import PartnerRentalDetails from "./pages/PartnerPages/PartnerRentalDetails";
import PartnerTourDetails from "./pages/PartnerPages/PartnerTourDetails";
import PartnerCarRentalDetails from "./pages/PartnerPages/PartnerCarRentalDetails";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPartner />} />
        <Route path="/LoginPartner" element={<LoginPartner />} />
        <Route path="/RegisterPartner" element={<RegisterPartner />} />
        <Route element={<ManagerLayout />}>
          <Route
            path="/ManagerAccountManagement"
            element={<ManagerAccountManagement />}
          />
          <Route path="/ManagerDashboard" element={<ManagerDashboard />} />
          {/* <Route path="/ManagerDashboard" element={<ManagerDashboard />} />
          <Route path="/ManagerManagement" element={<ManagerManagement />} />
          <Route path="/ManagerVoucher" element={<ManagerVoucher />} />
          <Route path="/ManagerProfile" element={<ManagerProfile />} /> */}
        </Route>
        <Route element={<PartnerLayout />}>
          <Route path="/PartnerDashboard" element={<PartnerDashboard />} />
          <Route path="/PartnerService" element={<PartnerService />} />
          <Route
            path="/PartnerService/rental"
            element={<PartnerRentalRegistration />}
          />
          <Route
            path="/PartnerService/tour"
            element={<PartnerTourRegistration />}
          />
          <Route
            path="/PartnerService/car"
            element={<PartnerCarRentalRegistration />}
          />
          <Route
            path="/PartnerService/rentalDetail"
            element={<PartnerRentalDetails />}
          />
          <Route
            path="/PartnerService/tourDetail"
            element={<PartnerTourDetails />}
          />
          <Route
            path="/PartnerService/carDetail"
            element={<PartnerCarRentalDetails />}
          />
          <Route path="/PartnerFinance" element={<PartnerFinance />} />
          <Route path="/PartnerBooking" element={<PartnerBooking />} />
          <Route
            path="/PartnerBookingDetails"
            element={<PartnerBookingDetails />}
          />
          <Route path="/PartnerProfile" element={<PartnerProfile />} />
          <Route path="/PartnerPromotion" element={<PartnerPromotion />} />
          <Route path="/PartnerMessaging" element={<PartnerMessaging />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
