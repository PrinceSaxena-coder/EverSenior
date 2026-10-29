import { useState } from "react";
import {
  Activity,
  Bell,
  ChevronDown,
  CircleHelp,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  ShieldCheck,
  Settings,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

type FamilyNavbarProps = {
  userName?: string;
};

type DropdownItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

function DropdownItem({
  to,
  icon,
  label,
  onClick,
}: DropdownItemProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#5F4633] transition hover:bg-[#F3ECE3]"
    >
      <span className="text-[#6F5139]">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function FamilyNavbar({
  userName = "Prince",
}: FamilyNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/family/dashboard") {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  const handleNavigation = () => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");

    setProfileOpen(false);
    setMobileMenuOpen(false);

    navigate("/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      to: "/family/dashboard",
      icon: <LayoutDashboard size={17} />,
    },
    {
      label: "My Seniors",
      to: "/family/seniors",
      icon: <Users size={17} />,
    },
    {
      label: "Companions",
      to: "/family/companions",
      icon: <Users size={17} />,
    },
    {
      label: "Bookings",
      to: "/family/bookings",
      icon: <Activity size={17} />,
    },
    {
      label: "Messages",
      to: "/family/messages",
      icon: <MessageCircle size={17} />,
    },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-[#E2DBD0] bg-[#F7F3EC]">
        <div className="flex h-[72px] w-full items-center justify-between px-5 sm:px-7 lg:px-10">

          {/* Logo */}
          <Link
            to="/family/dashboard"
            onClick={handleNavigation}
            className="flex shrink-0 items-center"
          >
            <span className="text-xl font-bold tracking-tight text-[#6F5139] sm:text-2xl">
              EverSenior
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = isActive(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-[#6F5139] text-white shadow-sm"
                      : "text-[#5F4633] hover:bg-[#F3ECE3]"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden items-center gap-2 lg:flex">

            {/* Notifications */}
            <Link
              to="/family/notifications"
              onClick={handleNavigation}
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition ${
                isActive("/family/notifications")
                  ? "bg-[#6F5139] text-white"
                  : "text-[#5F4633] hover:bg-[#F3ECE3]"
              }`}
              aria-label="Notifications"
            >
              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#A66A4C]" />
            </Link>

            {/* Profile */}
            <div className="relative ml-1">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition ${
                  profileOpen
                    ? "border-[#6F5139] bg-[#F3ECE3]"
                    : "border-[#E2DBD0] bg-white hover:bg-[#F3ECE3]"
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6F5139] text-sm font-semibold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>

                <span className="max-w-[100px] truncate text-sm font-semibold text-[#30271F]">
                  {userName}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-[#6F5139] transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-2xl border border-[#E2DBD0] bg-white shadow-xl">

                  {/* Profile Header */}
                  <div className="border-b border-[#E4DDD2] bg-[#FBF9F6] px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6F5139] text-base font-semibold text-white">
                        {userName.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#30271F]">
                          {userName}
                        </p>

                        <p className="mt-0.5 text-xs text-[#857668]">
                          Family Member
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown */}
                  <div className="max-h-[calc(100vh-150px)] overflow-y-auto overscroll-contain p-2">

                    <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A8877]">
                      Account
                    </p>

                    <DropdownItem
                      to="/family/profile"
                      icon={<Users size={17} />}
                      label="My Profile"
                      onClick={handleNavigation}
                    />

                    <DropdownItem
                      to="/family/payments"
                      icon={<Wallet size={17} />}
                      label="Payments"
                      onClick={handleNavigation}
                    />

                    <DropdownItem
                      to="/family/safety"
                      icon={<ShieldCheck size={17} />}
                      label="Safety Center"
                      onClick={handleNavigation}
                    />

                    <DropdownItem
                      to="/family/activity"
                      icon={<Activity size={17} />}
                      label="Activity"
                      onClick={handleNavigation}
                    />

                    <div className="my-2 border-t border-[#E7DFD6]" />

                    <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A8877]">
                      Support
                    </p>

                    <DropdownItem
                      to="/family/notifications"
                      icon={<Bell size={17} />}
                      label="Notifications"
                      onClick={handleNavigation}
                    />

                    <DropdownItem
                      to="/family/help"
                      icon={<CircleHelp size={17} />}
                      label="Help Centre"
                      onClick={handleNavigation}
                    />

                    <DropdownItem
                      to="/family/customer-care"
                      icon={<MessageCircle size={17} />}
                      label="Customer Care"
                      onClick={handleNavigation}
                    />

                    <DropdownItem
                      to="/family/tickets"
                      icon={<CreditCard size={17} />}
                      label="My Tickets"
                      onClick={handleNavigation}
                    />

                    <div className="my-2 border-t border-[#E7DFD6]" />

                    <DropdownItem
                      to="/family/settings"
                      icon={<Settings size={17} />}
                      label="Settings"
                      onClick={handleNavigation}
                    />

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#8A4F3D] transition hover:bg-[#F8ECE7]"
                    >
                      <LogOut size={17} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">

            {/* Mobile Notifications */}
            <Link
              to="/family/notifications"
              onClick={handleNavigation}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#5F4633] transition hover:bg-[#F3ECE3]"
              aria-label="Notifications"
            >
              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#A66A4C]" />
            </Link>

            {/* Menu */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-[#5F4633] transition hover:bg-[#F3ECE3]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-[#E2DBD0] bg-[#F7F3EC] lg:hidden">
            <div className="max-h-[calc(100vh-72px)] overflow-y-auto overscroll-contain px-4 py-4">

              {/* Main Navigation */}
              <div className="space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.to);

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={handleNavigation}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        active
                          ? "bg-[#6F5139] text-white"
                          : "text-[#5F4633] hover:bg-[#F3ECE3]"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <Link
                  to="/family/notifications"
                  onClick={handleNavigation}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive("/family/notifications")
                      ? "bg-[#6F5139] text-white"
                      : "text-[#5F4633] hover:bg-[#F3ECE3]"
                  }`}
                >
                  <Bell size={18} />
                  <span>Notifications</span>
                </Link>
              </div>

              <div className="my-4 border-t border-[#E2DBD0]" />

              {/* Mobile Account */}
              <div className="rounded-2xl border border-[#E2DBD0] bg-white p-3">

                <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#FBF9F6] p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6F5139] text-sm font-semibold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#30271F]">
                      {userName}
                    </p>

                    <p className="text-xs text-[#857668]">
                      Family Member
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    to="/family/profile"
                    onClick={handleNavigation}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#5F4633] hover:bg-[#F3ECE3]"
                  >
                    <Users size={17} />
                    My Profile
                  </Link>

                  <Link
                    to="/family/payments"
                    onClick={handleNavigation}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#5F4633] hover:bg-[#F3ECE3]"
                  >
                    <Wallet size={17} />
                    Payments
                  </Link>

                  <Link
                    to="/family/safety"
                    onClick={handleNavigation}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#5F4633] hover:bg-[#F3ECE3]"
                  >
                    <ShieldCheck size={17} />
                    Safety Center
                  </Link>

                  <Link
                    to="/family/activity"
                    onClick={handleNavigation}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#5F4633] hover:bg-[#F3ECE3]"
                  >
                    <Activity size={17} />
                    Activity
                  </Link>

                  <Link
                    to="/family/help"
                    onClick={handleNavigation}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#5F4633] hover:bg-[#F3ECE3]"
                  >
                    <CircleHelp size={17} />
                    Help Centre
                  </Link>

                  <Link
                    to="/family/customer-care"
                    onClick={handleNavigation}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#5F4633] hover:bg-[#F3ECE3]"
                  >
                    <MessageCircle size={17} />
                    Customer Care
                  </Link>

                  <Link
                    to="/family/tickets"
                    onClick={handleNavigation}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#5F4633] hover:bg-[#F3ECE3]"
                  >
                    <CreditCard size={17} />
                    My Tickets
                  </Link>

                  <Link
                    to="/family/settings"
                    onClick={handleNavigation}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#5F4633] hover:bg-[#F3ECE3]"
                  >
                    <Settings size={17} />
                    Settings
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#8A4F3D] hover:bg-[#F8ECE7]"
                  >
                    <LogOut size={17} />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}