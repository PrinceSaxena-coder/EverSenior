import { useEffect, useState } from "react";
import {
  Bell,
  ChevronRight,
  Globe2,
  Lock,
  LogOut,
  Moon,
  ShieldCheck,
  Smartphone,
  Sun,
  UserRound,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import FamilyNavbar from "./FamilyNavbar";

type SettingsState = {
  emailNotifications: boolean;
  bookingUpdates: boolean;
  sessionReminders: boolean;
  safetyAlerts: boolean;
  companionUpdates: boolean;
  marketingEmails: boolean;
  smsNotifications: boolean;
  darkMode: boolean;
  language: string;
  profileVisibility: boolean;
};

const defaultSettings: SettingsState = {
  emailNotifications: true,
  bookingUpdates: true,
  sessionReminders: true,
  safetyAlerts: true,
  companionUpdates: true,
  marketingEmails: false,
  smsNotifications: true,
  darkMode: false,
  language: "English",
  profileVisibility: true,
};

export default function Settings() {
  const navigate = useNavigate();

  const [settings, setSettings] =
    useState<SettingsState>(defaultSettings);

  const [saved, setSaved] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const storedSettings = localStorage.getItem("familySettings");

    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        setSettings({
          ...defaultSettings,
          ...parsed,
        });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  const updateSetting = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      "familySettings",
      JSON.stringify(settings)
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      alert("New password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    /*
      Prototype only:
      In production, this should be handled by
      a secure backend authentication service.
    */

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordForm(false);

    alert("Password updated successfully.");
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
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* Header */}
        <section className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#6F5139]">
            Account
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-[#30271F] sm:text-4xl">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#76695D] sm:text-base">
            Manage your EverSenior preferences, notifications,
            privacy and account security.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* Main Settings */}
          <div className="space-y-6">

            {/* Notifications */}
            <SettingsCard
              icon={<Bell className="h-5 w-5" />}
              title="Notifications"
              description="Choose how EverSenior keeps you updated."
            >
              <div className="divide-y divide-[#E7DED3]">
                <ToggleRow
                  title="Email notifications"
                  description="Receive important updates and account information by email."
                  checked={settings.emailNotifications}
                  onChange={(value) =>
                    updateSetting("emailNotifications", value)
                  }
                />

                <ToggleRow
                  title="Booking updates"
                  description="Get notified when a booking is created, accepted, changed or cancelled."
                  checked={settings.bookingUpdates}
                  onChange={(value) =>
                    updateSetting("bookingUpdates", value)
                  }
                />

                <ToggleRow
                  title="Session reminders"
                  description="Receive reminders before upcoming companionship sessions."
                  checked={settings.sessionReminders}
                  onChange={(value) =>
                    updateSetting("sessionReminders", value)
                  }
                />

                <ToggleRow
                  title="Safety alerts"
                  description="Receive important safety and wellbeing notifications."
                  checked={settings.safetyAlerts}
                  onChange={(value) =>
                    updateSetting("safetyAlerts", value)
                  }
                />

                <ToggleRow
                  title="Companion updates"
                  description="Receive updates about your seniors' companions."
                  checked={settings.companionUpdates}
                  onChange={(value) =>
                    updateSetting("companionUpdates", value)
                  }
                />

                <ToggleRow
                  title="SMS notifications"
                  description="Receive selected booking and safety updates through SMS."
                  checked={settings.smsNotifications}
                  onChange={(value) =>
                    updateSetting("smsNotifications", value)
                  }
                />

                <ToggleRow
                  title="Offers and newsletters"
                  description="Receive occasional EverSenior news, offers and updates."
                  checked={settings.marketingEmails}
                  onChange={(value) =>
                    updateSetting("marketingEmails", value)
                  }
                />
              </div>
            </SettingsCard>

            {/* Appearance */}
            <SettingsCard
              icon={<Sun className="h-5 w-5" />}
              title="Appearance"
              description="Customize how EverSenior looks for you."
            >
              <div className="space-y-5">

                <div>
                  <p className="text-sm font-semibold text-[#30271F]">
                    Theme
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">

                    <ThemeOption
                      active={!settings.darkMode}
                      icon={<Sun className="h-5 w-5" />}
                      title="Light"
                      description="Warm and easy to read"
                      onClick={() =>
                        updateSetting("darkMode", false)
                      }
                    />

                    <ThemeOption
                      active={settings.darkMode}
                      icon={<Moon className="h-5 w-5" />}
                      title="Dark"
                      description="Coming soon"
                      disabled
                      onClick={() => {}}
                    />

                  </div>
                </div>

                <div className="border-t border-[#E7DED3] pt-5">
                  <label className="block text-sm font-semibold text-[#30271F]">
                    Language
                  </label>

                  <div className="relative mt-2">
                    <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A7765]" />

                    <select
                      value={settings.language}
                      onChange={(event) =>
                        updateSetting(
                          "language",
                          event.target.value
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-[#DDD3C8] bg-white py-3 pl-10 pr-4 text-sm text-[#30271F] outline-none transition focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10"
                    >
                      <option>English</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                </div>

              </div>
            </SettingsCard>

            {/* Privacy */}
            <SettingsCard
              icon={<Eye className="h-5 w-5" />}
              title="Privacy"
              description="Control what information is visible to others."
            >
              <ToggleRow
                title="Profile visibility"
                description="Allow companions and relevant EverSenior staff to see your basic family profile."
                checked={settings.profileVisibility}
                onChange={(value) =>
                  updateSetting("profileVisibility", value)
                }
              />

              <div className="mt-5 rounded-xl border border-[#E4DDD2] bg-[#FAF7F2] p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#6F5139]" />

                  <div>
                    <p className="text-sm font-semibold text-[#30271F]">
                      Your family's privacy matters
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#76695D]">
                      EverSenior only shares information required
                      to coordinate companionship, bookings and
                      safety.
                    </p>
                  </div>
                </div>
              </div>
            </SettingsCard>

            {/* Security */}
            <SettingsCard
              icon={<Lock className="h-5 w-5" />}
              title="Security"
              description="Keep your EverSenior account secure."
            >
              <div className="flex flex-col gap-4 rounded-xl border border-[#E4DDD2] bg-[#FAF7F2] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFE6DA] text-[#6F5139]">
                    <Lock className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#30271F]">
                      Password
                    </p>

                    <p className="mt-1 text-xs text-[#76695D]">
                      Change your account password regularly.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordForm((prev) => !prev)
                  }
                  className="rounded-xl border border-[#CFC3B5] bg-white px-4 py-2.5 text-sm font-semibold text-[#6F5139] transition hover:bg-[#F3ECE3]"
                >
                  {showPasswordForm
                    ? "Cancel"
                    : "Change Password"}
                </button>
              </div>

              {showPasswordForm && (
                <div className="mt-5 rounded-xl border border-[#E4DDD2] bg-white p-5">
                  <div className="grid gap-4">

                    <PasswordInput
                      label="Current password"
                      value={currentPassword}
                      onChange={setCurrentPassword}
                      visible={showCurrentPassword}
                      onToggle={() =>
                        setShowCurrentPassword((prev) => !prev)
                      }
                    />

                    <PasswordInput
                      label="New password"
                      value={newPassword}
                      onChange={setNewPassword}
                      visible={showNewPassword}
                      onToggle={() =>
                        setShowNewPassword((prev) => !prev)
                      }
                    />

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#4C4035]">
                        Confirm new password
                      </label>

                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        placeholder="Re-enter new password"
                        className="w-full rounded-xl border border-[#DDD3C8] bg-[#FAF8F5] px-4 py-3 text-sm text-[#30271F] outline-none transition placeholder:text-[#A09283] focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10"
                      />
                    </div>

                    <div className="flex items-start gap-2 rounded-xl bg-[#F7F1E9] p-3 text-xs leading-5 text-[#76695D]">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#8A6B48]" />

                      <span>
                        Password changes are simulated in this
                        prototype. A production version should use
                        secure backend authentication.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handlePasswordChange}
                      className="w-full rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633] sm:w-fit"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-center gap-3 border-t border-[#E7DED3] pt-5">
                <Smartphone className="h-5 w-5 text-[#6F5139]" />

                <div>
                  <p className="text-sm font-semibold text-[#30271F]">
                    Two-factor authentication
                  </p>

                  <p className="mt-1 text-xs text-[#76695D]">
                    Extra account protection will be available soon.
                  </p>
                </div>

                <span className="ml-auto rounded-full bg-[#F1E8DE] px-3 py-1 text-[11px] font-semibold text-[#7B624B]">
                  Coming soon
                </span>
              </div>
            </SettingsCard>

            {/* Account */}
            <SettingsCard
              icon={<UserRound className="h-5 w-5" />}
              title="Account"
              description="Manage your account and personal preferences."
            >
              <div className="divide-y divide-[#E7DED3]">

                <AccountLink
                  to="/family/profile"
                  title="Personal information"
                  description="Update your name, contact details and emergency contact."
                />

                <AccountLink
                  to="/family/notifications"
                  title="Notification center"
                  description="View your recent EverSenior notifications."
                />

                <AccountLink
                  to="/family/payments"
                  title="Payment methods"
                  description="Manage payment methods and transaction history."
                />

                <AccountLink
                  to="/family/safety"
                  title="Safety Center"
                  description="Review safety tools, contacts and wellbeing information."
                />

              </div>
            </SettingsCard>

            {/* Save */}
            <div className="sticky bottom-4 z-10">
              <div className="flex flex-col gap-3 rounded-2xl border border-[#DDD3C8] bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-2">
                  {saved ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-[#5F7657]" />

                      <p className="text-sm font-medium text-[#4D6148]">
                        Settings saved successfully.
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-[#76695D]">
                      Remember to save your preference changes.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6F5139] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>

              </div>
            </div>

            {/* Danger Zone */}
            <section className="rounded-2xl border border-[#E5CFC8] bg-[#FFF9F7] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5E4DF] text-[#9A5F51]">
                  <LogOut className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-[#6F3F36]">
                    Sign out
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#80645C]">
                    Sign out of your EverSenior family account on
                    this device.
                  </p>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-4 rounded-xl border border-[#D8BDB6] bg-white px-4 py-2.5 text-sm font-semibold text-[#8C5045] transition hover:bg-[#FFF3F0]"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </section>

          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">

            {/* Settings Summary */}
            <section className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EFE6DA] text-[#6F5139]">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h2 className="mt-4 text-base font-semibold text-[#30271F]">
                Account protection
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#76695D]">
                Your account settings help keep your family's
                information secure.
              </p>

              <div className="mt-5 space-y-3">

                <SecurityStatus
                  label="Account verified"
                  status="Active"
                />

                <SecurityStatus
                  label="Safety alerts"
                  status={
                    settings.safetyAlerts
                      ? "Enabled"
                      : "Disabled"
                  }
                />

                <SecurityStatus
                  label="SMS notifications"
                  status={
                    settings.smsNotifications
                      ? "Enabled"
                      : "Disabled"
                  }
                />

              </div>
            </section>

            {/* Quick Links */}
            <section className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-[#30271F]">
                Quick links
              </h2>

              <div className="mt-3 divide-y divide-[#E7DED3]">

                <SidebarLink
                  to="/family/profile"
                  icon={<UserRound className="h-4 w-4" />}
                  label="My Profile"
                />

                <SidebarLink
                  to="/family/safety"
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="Safety Center"
                />

                <SidebarLink
                  to="/family/payments"
                  icon={<Smartphone className="h-4 w-4" />}
                  label="Payments"
                />

              </div>
            </section>

            {/* Help */}
            <section className="rounded-2xl border border-[#E2DBD0] bg-[#F3ECE3] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6F5139]">
                Need help?
              </p>

              <h2 className="mt-2 text-lg font-semibold text-[#30271F]">
                We're here for you.
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#76695D]">
                If you need assistance with your account or family
                bookings, our support team can help.
              </p>

              <Link
                to="/family/customer-care"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#6F5139] hover:text-[#5F4633]"
              >
                Contact Customer Care
                <ChevronRight className="h-4 w-4" />
              </Link>
            </section>

          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-[#E2DBD0] bg-[#F3ECE3]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-[#76695D] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} EverSenior. Built around
            trust, companionship and care.
          </p>

          <div className="flex gap-4">
            <Link
              to="/family/help"
              className="hover:text-[#6F5139]"
            >
              Help
            </Link>

            <Link
              to="/family/safety"
              className="hover:text-[#6F5139]"
            >
              Safety
            </Link>

            <Link
              to="/family/customer-care"
              className="hover:text-[#6F5139]"
            >
              Customer Care
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable Components                                                        */
/* -------------------------------------------------------------------------- */

function SettingsCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E2DBD0] bg-white shadow-sm">
      <div className="border-b border-[#E7DED3] px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFE6DA] text-[#6F5139]">
            {icon}
          </div>

          <div>
            <h2 className="text-base font-semibold text-[#30271F]">
              {title}
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#76695D]">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#30271F]">
          {title}
        </p>

        <p className="mt-1 max-w-xl text-xs leading-5 text-[#76695D]">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#6F5139]" : "bg-[#CFC5B9]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function ThemeOption({
  active,
  icon,
  title,
  description,
  onClick,
  disabled = false,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
        active
          ? "border-[#6F5139] bg-[#F7F1E9]"
          : "border-[#DDD3C8] bg-white hover:bg-[#FAF7F2]"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          active
            ? "bg-[#E8DCCF] text-[#6F5139]"
            : "bg-[#F3ECE3] text-[#8A7765]"
        }`}
      >
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-[#30271F]">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-[#76695D]">
          {description}
        </p>
      </div>
    </button>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#4C4035]">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-[#DDD3C8] bg-[#FAF8F5] px-4 py-3 pr-12 text-sm text-[#30271F] outline-none transition placeholder:text-[#A09283] focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7765] hover:text-[#6F5139]"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function AccountLink({
  to,
  title,
  description,
}: {
  to: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
    >
      <div>
        <p className="text-sm font-semibold text-[#30271F] group-hover:text-[#6F5139]">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-[#76695D]">
          {description}
        </p>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-[#A09283] transition group-hover:translate-x-0.5 group-hover:text-[#6F5139]" />
    </Link>
  );
}

function SidebarLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 py-3 text-sm font-medium text-[#4C4035] transition hover:text-[#6F5139]"
    >
      <span className="text-[#6F5139]">{icon}</span>

      <span>{label}</span>

      <ChevronRight className="ml-auto h-4 w-4 text-[#A09283]" />
    </Link>
  );
}

function SecurityStatus({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-[#76695D]">
        {label}
      </span>

      <span className="flex items-center gap-1.5 text-xs font-semibold text-[#5F7657]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#5F7657]" />
        {status}
      </span>
    </div>
  );
}