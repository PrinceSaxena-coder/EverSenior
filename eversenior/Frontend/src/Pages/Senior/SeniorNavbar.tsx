import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Settings,
  User,
  X,
  CalendarDays,
  Heart,
  Siren,
} from "lucide-react";

type NavItem = {
  label: string;
  path: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "/senior/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Find Companion",
    path: "/senior/companions",
    icon: Search,
  },
  {
    label: "Bookings",
    path: "/senior/bookings",
    icon: CalendarDays,
  },
  {
    label: "Messages",
    path: "/senior/messages",
    icon: MessageCircle,
  },
  {
    label: "Events",
    path: "/senior/events",
    icon: Heart,
  },
];

export default function SeniorNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const userName = localStorage.getItem("userName") || "Prince";

  const userEmail = localStorage.getItem("userEmail") || "prince@example.com";

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/senior/dashboard") {
      return location.pathname === path;
    }

    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");

    navigate("/login");
  };

  return (
    <>
      {/* ================= DESKTOP / MAIN NAVBAR ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E4DDD2] bg-white">
        <div className="flex h-[76px] w-full items-center justify-between px-6 sm:px-8 lg:px-10">
          {/* Logo */}
          <Link
            to="/senior/dashboard"
            className="flex shrink-0 items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6F5139]">
              <Heart size={20} strokeWidth={2} className="text-white" />
            </div>

            <div className="hidden sm:block">
              <p className="text-[18px] font-bold tracking-tight text-[#30271F]">
                EverSenior
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#8B735D]">
                Companionship
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden flex-1 items-center justify-center gap-1 px-8 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-[#F3ECE3] text-[#6F5139]"
                      : "text-[#6F6257] hover:bg-[#F7F3EC] hover:text-[#5D432F]"
                  }`}
                >
                  <Icon size={17} strokeWidth={1.8} />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Notifications */}
            <Link
              to="/senior/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-[#6F6257] transition hover:bg-[#F7F3EC] hover:text-[#5D432F]"
              title="Notifications"
            >
              <Bell size={19} strokeWidth={1.8} />

              {/* Notification dot */}
              <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full bg-[#8B5E3C]" />
            </Link>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-[#F7F3EC]"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6F5139] text-sm font-semibold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>

                {/* Name */}
                <span className="hidden max-w-[120px] truncate text-sm font-medium text-[#30271F] xl:block">
                  {userName}
                </span>

                <ChevronDown
                  size={16}
                  className={`hidden text-[#6F6257] transition-transform xl:block ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-[52px] w-64 overflow-hidden rounded-xl border border-[#E2DBD0] bg-white shadow-[0_12px_35px_rgba(48,39,31,0.12)]">
                  {/* User Info */}
                  <div className="border-b border-[#EDE7DE] px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#6F5139] font-semibold text-white">
                        {userName.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#30271F]">
                          {userName}
                        </p>

                        <p className="truncate text-xs text-[#8B7B6B]">
                          {userEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Links */}
                  <div className="p-2">
                    {/* My Profile */}
                    <Link
                      to="/senior/profile"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#5F5145] transition hover:bg-[#F7F3EC]"
                    >
                      <User size={17} strokeWidth={1.8} />

                      <span>My Profile</span>
                    </Link>

                    {/* Settings */}
                    <Link
                      to="/senior/settings"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#5F5145] transition hover:bg-[#F7F3EC]"
                    >
                      <Settings size={17} strokeWidth={1.8} />

                      <span>Settings</span>
                    </Link>

                    {/* Notifications */}
                    <Link
                      to="/senior/notifications"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#5F5145] transition hover:bg-[#F7F3EC]"
                    >
                      <Bell size={17} strokeWidth={1.8} />

                      <span>Notifications</span>
                    </Link>

                    {/* Divider */}
                    <div className="my-2 border-t border-[#EDE7DE]" />

                    {/* SOS Help */}
                    <Link
                      to="/senior/sos"
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-3 rounded-lg bg-[#FFF4F1] px-3 py-2.5 text-left text-sm font-semibold text-[#A33F2B] transition hover:bg-[#FCE8E3]"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FDE4DE]">
                        <Siren
                          size={17}
                          strokeWidth={1.8}
                          className="text-[#A33F2B]"
                        />
                      </div>

                      <div>
                        <p>SOS Help</p>
                        <p className="text-[11px] font-normal text-[#B66A5A]">
                          Get emergency assistance
                        </p>
                      </div>
                    </Link>

                    {/* Divider */}
                    <div className="my-2 border-t border-[#EDE7DE]" />

                    {/* Sign Out */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#9A4F3D] transition hover:bg-[#FBF0ED]"
                    >
                      <LogOut size={17} strokeWidth={1.8} />

                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-[#5D432F] transition hover:bg-[#F7F3EC] lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileMenuOpen && (
          <div className="border-t border-[#E4DDD2] bg-white lg:hidden">
            <nav className="space-y-1 px-4 py-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-[#F3ECE3] text-[#6F5139]"
                        : "text-[#6F6257] hover:bg-[#F7F3EC]"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.8} />

                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="my-3 border-t border-[#EDE7DE]" />

              {/* Mobile Profile */}
              <Link
                to="/senior/profile"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#6F6257] hover:bg-[#F7F3EC]"
              >
                <User size={18} />

                <span>My Profile</span>
              </Link>

              <Link
                to="/senior/settings"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#6F6257] hover:bg-[#F7F3EC]"
              >
                <Settings size={18} />

                <span>Settings</span>
              </Link>

              <Link
                to="/senior/notifications"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#6F6257] hover:bg-[#F7F3EC]"
              >
                <Bell size={18} />

                <span>Notifications</span>
              </Link>

              {/* Mobile SOS */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  alert("SOS Help will be available soon.");
                }}
                className="flex w-full items-center gap-3 rounded-lg bg-[#FFF4F1] px-4 py-3 text-left text-sm font-semibold text-[#A33F2B] hover:bg-[#FCE8E3]"
              >
                <Siren size={18} strokeWidth={1.8} />

                <span>SOS Help</span>
              </button>

              {/* Mobile Sign Out */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-[#9A4F3D] hover:bg-[#FBF0ED]"
              >
                <LogOut size={18} />

                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
