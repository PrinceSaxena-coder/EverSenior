import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { IntroSection } from "./components/IntroSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { Testimonials } from "./components/Testimonials";
import { Gallery } from "./components/Gallery";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";

// Public Pages
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Services from "./Pages/Services";
import About from "./Pages/About";
import Events from "./Pages/Events";
import Press from "./Pages/Press";
import FAQsPage from "./Pages/FAQ";
import Careers from "./Pages/Career";
import Contact from "./Pages/Contact";
import Terms from "./Pages/terms";
import PrivacyPolicy from "./Pages/privacypolicy";

// Senior Pages
import SeniorDashboard from "./Pages/Senior/SeniorDashboard";
import FindCompanion from "./Pages/Senior/FindCompanion";
import CProfile from "./Pages/Senior/CompanionProfile";
import CompanionBooking from "./Pages/Senior/CompanionBooking";
import Bookings from "./Pages/Senior/Bookings";
import Messages from "./Pages/Senior/Message";
import Profile from "./Pages/Senior/Profile";
import Settings from "./Pages/Senior/Setting";
import Event from "./Pages/Senior/Events";
import Notifications from "./Pages/Senior/Notification";
import SOS from "./Pages/Senior/SOS";

// Companion Pages
import CompanionDashboard from "./Pages/Companion/CompanionDashboard";
import Explore from "./Pages/Companion/Explore";
import CompanionProfile from "./Pages/Companion/Profile";
import MySessions from "./Pages/Companion/MySession";
import Pocket from "./Pages/Companion/Pocket";
import CompanionMessages from "./Pages/Companion/Message";
import CompanionNotifications from "./Pages/Companion/Notification";
import PsychometricTest from "./Pages/Companion/PsychometricTest";
import Training from "./Pages/Companion/Training";
import Help from "./Pages/Companion/Help";
import MyTickets from "./Pages/Companion/Mytickets";
import MedicalServices from "./Pages/Companion/MedicalServices";
import MedicalInsurance from "./Pages/Companion/MedicalInsurance";
import IDCard from "./Pages/Companion/IdCard";
import Agreement from "./Pages/Companion/Agreement";

// Family Pages
import FamilyDashboard from "./Pages/Family_Member/FamilyDashboard";
import MySeniors from "./Pages/Family_Member/MySeniors";
import SeniorProfile from "./Pages/Family_Member/SeniorProfile";
import FindCompanions from "./Pages/Family_Member/FindCompanion";
import CompanionProfiles from "./Pages/Family_Member/CompanionProfile";
import FamilyBooking from "./Pages/Family_Member/FamilyBooking";
import FamilyBookings from "./Pages/Family_Member/Bookings";
import FamilyMessages from "./Pages/Family_Member/Messages";
import FamilyNotifications from "./Pages/Family_Member/Notifications";
import FamilySafetyCenter from "./Pages/Family_Member/SafetyCenter";
import FamilyPayments from "./Pages/Family_Member/Payments";
import FamilyProfile from "./Pages/Family_Member/Profile";
import FamilySettings from "./Pages/Family_Member/Settings";
import FamilyHelpCentre from "./Pages/Family_Member/HelpCentre";
import FamilyCustomerCare from "./Pages/Family_Member/CustomerCare";
import FamilyTickets from "./Pages/Family_Member/Tickets";
import FamilyActivity from "./Pages/Family_Member/Activity";
import PinkDemo from "./Pages/Family_Member/PinkDemo";

/* ---------------------------------
   Home Page
---------------------------------- */

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <IntroSection />
        <ExperienceSection />
        <Testimonials />
        <Gallery />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}

/* ---------------------------------
   App
---------------------------------- */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            PUBLIC PAGES
        ========================= */}

        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main Navbar Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/events" element={<Events />} />
        <Route path="/press" element={<Press />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* =========================
            SENIOR PAGES
        ========================= */}

        {/* Dashboard */}
        <Route path="/senior/dashboard" element={<SeniorDashboard />} />

        {/* Find Companion */}
        <Route path="/senior/companions" element={<FindCompanion />} />

        {/* Individual Companion Profile */}
        <Route path="/senior/companions/:id" element={<CProfile />} />

        {/* =================================
            COMPANION BOOKING FLOW
        ================================= */}

        <Route
          path="/senior/companions/:id/book"
          element={<CompanionBooking />}
        />

        {/* User's Bookings */}
        <Route path="/senior/bookings" element={<Bookings />} />

        {/* Messages */}
        <Route path="/senior/messages" element={<Messages />} />

        {/* Profile */}
        <Route path="/senior/profile" element={<Profile />} />

        {/* Settings */}
        <Route path="/senior/settings" element={<Settings />} />

        {/* Events */}
        <Route path="/senior/events" element={<Event />} />

        {/* Notifications */}
        <Route path="/senior/notifications" element={<Notifications />} />

        {/* SOS */}
        <Route path="/senior/sos" element={<SOS />} />

        {/* =========================
            COMPANION PAGES
        ========================= */}

        <Route path="/companion/dashboard" element={<CompanionDashboard />} />
        <Route path="/companion/explore" element={<Explore />} />
        <Route path="/companion/profile" element={<CompanionProfile />} />
        <Route path="/companion/sessions" element={<MySessions />} />
        <Route path="/companion/pocket" element={<Pocket />} />
        <Route path="/companion/messages" element={<CompanionMessages />} />
        <Route
          path="/companion/psychometric-test"
          element={<PsychometricTest />}
        />
        <Route
          path="/companion/notifications"
          element={<CompanionNotifications />}
        />
        <Route path="/companion/training" element={<Training />} />
        <Route path="/companion/help" element={<Help />} />
        <Route path="/companion/my-tickets" element={<MyTickets />} />
        <Route
          path="/companion/medical-services"
          element={<MedicalServices />}
        />
        <Route
          path="/companion/medical-insurance"
          element={<MedicalInsurance />}
        />
        <Route path="/companion/id-card" element={<IDCard />} />
        <Route path="/companion/agreement" element={<Agreement />} />

        {/* ================================
          FAMILY MEMBERS PAGES
        ==================================== */}

        <Route path="/family/dashboard" element={<FamilyDashboard />} />
        <Route path="/family/seniors" element={<MySeniors />} />
        <Route path="/family/seniors/:id" element={<SeniorProfile />} />
        <Route path="/family/companions" element={<FindCompanions />} />
        <Route path="/family/companions/:id" element={<CompanionProfiles />} />
        <Route path="/family/book" element={<FamilyBooking />} />
        <Route path="/family/bookings" element={<FamilyBookings />} />
        <Route path="/family/messages" element={<FamilyMessages />} />
        <Route path="/family/notifications" element={<FamilyNotifications />} />
        <Route path="/family/safety" element={<FamilySafetyCenter />} />
        <Route path="/family/payments" element={<FamilyPayments />} />
        <Route path="/family/profile" element={<FamilyProfile />} />
        <Route path="/family/settings" element={<FamilySettings />} />
        <Route path="/family/help" element={<FamilyHelpCentre />} />
        <Route path="/family/customer-care" element={<FamilyCustomerCare />} />
        <Route path="/family/tickets" element={<FamilyTickets />} />
        <Route path="/family/activity" element={<FamilyActivity />} />
        <Route path="/family/pink" element={<PinkDemo />} />
      </Routes>
    </BrowserRouter>
  );
}
