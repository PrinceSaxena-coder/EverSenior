import { useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Pencil,
  Save,
  X,
  Heart,
  UsersRound,
  CalendarDays,
  LockKeyhole,
  CheckCircle2,
  Camera,
  Bell,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import FamilyNavbar from "./FamilyNavbar";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  relationship: string;
  city: string;
  address: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelationship: string;
};

const defaultProfile: ProfileData = {
  fullName: "Prince Saxena",
  email: "prince@example.com",
  phone: "+91 98765 43210",
  relationship: "Family Member",
  city: "Noida",
  address: "Noida, Uttar Pradesh",
  emergencyName: "Riya Saxena",
  emergencyPhone: "+91 98765 12345",
  emergencyRelationship: "Sibling",
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [draft, setDraft] = useState<ProfileData>(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");
    const storedPhone = localStorage.getItem("userPhone");
    const storedProfile = localStorage.getItem("familyProfile");

    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile) as ProfileData;

        setProfile(parsed);
        setDraft(parsed);
        return;
      } catch {
        // Fall back to the default profile.
      }
    }

    const updatedProfile = {
      ...defaultProfile,
      fullName: storedName || defaultProfile.fullName,
      email: storedEmail || defaultProfile.email,
      phone: storedPhone || defaultProfile.phone,
    };

    setProfile(updatedProfile);
    setDraft(updatedProfile);
  }, []);

  const startEditing = () => {
    setDraft(profile);
    setSaved(false);
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraft(profile);
    setSaved(false);
    setEditing(false);
  };

  const saveProfile = () => {
    setProfile(draft);

    localStorage.setItem("familyProfile", JSON.stringify(draft));
    localStorage.setItem("userName", draft.fullName);
    localStorage.setItem("userEmail", draft.email);
    localStorage.setItem("userPhone", draft.phone);

    setEditing(false);
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const updateField = (
    field: keyof ProfileData,
    value: string
  ) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6F5139] text-white">
                  <UserRound size={19} />
                </div>

                <span className="text-sm font-medium text-[#76563C]">
                  Family Account
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                My Profile
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#756A60] sm:text-base">
                Manage your personal information and the details EverSenior
                uses to keep your family account connected.
              </p>
            </div>

            {!editing ? (
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E2DBD0] bg-white px-4 py-2.5 text-sm font-medium text-[#6B6258] transition hover:bg-[#F3ECE3]"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveProfile}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Saved notification */}
        {saved && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#DDE4DC] bg-[#F3F7F2] px-4 py-3 text-sm text-[#58705A]">
            <CheckCircle2 size={18} />
            Your profile has been updated successfully.
          </div>
        )}

        {/* Profile Hero */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-[#E2DBD0] bg-white shadow-sm">
          <div className="h-28 bg-[#6F5139] sm:h-36" />

          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-10 flex flex-col gap-5 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-[#F3ECE3] text-2xl font-semibold text-[#6F5139] shadow-sm sm:h-24 sm:w-24">
                    {profile.fullName
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#6F5139] text-white shadow-sm"
                    aria-label="Change profile photo"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-semibold">
                      {profile.fullName}
                    </h2>

                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F0E9] px-2.5 py-1 text-xs font-medium text-[#58705A]">
                      <CheckCircle2 size={12} />
                      Verified
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-[#756A60]">
                    {profile.relationship} · {profile.city}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:flex">
                <div className="rounded-xl bg-[#FBF8F3] px-4 py-3 text-center">
                  <p className="text-lg font-semibold">2</p>
                  <p className="text-xs text-[#8A8075]">Seniors</p>
                </div>

                <div className="rounded-xl bg-[#FBF8F3] px-4 py-3 text-center">
                  <p className="text-lg font-semibold">10</p>
                  <p className="text-xs text-[#8A8075]">Sessions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main grid */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          {/* Left */}
          <div className="space-y-6">
            {/* Personal Information */}
            <section className="rounded-2xl border border-[#E2DBD0] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E8E1D7] p-5 sm:p-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8A8075]">
                    Personal Information
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    About you
                  </h2>
                </div>

                <UserRound size={20} className="text-[#6F5139]" />
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
                <ProfileField
                  label="Full Name"
                  value={editing ? draft.fullName : profile.fullName}
                  icon={<UserRound size={17} />}
                  editing={editing}
                  onChange={(value) =>
                    updateField("fullName", value)
                  }
                />

                <ProfileField
                  label="Email Address"
                  value={editing ? draft.email : profile.email}
                  icon={<Mail size={17} />}
                  editing={editing}
                  type="email"
                  onChange={(value) =>
                    updateField("email", value)
                  }
                />

                <ProfileField
                  label="Phone Number"
                  value={editing ? draft.phone : profile.phone}
                  icon={<Phone size={17} />}
                  editing={editing}
                  type="tel"
                  onChange={(value) =>
                    updateField("phone", value)
                  }
                />

                <ProfileField
                  label="Relationship"
                  value={
                    editing
                      ? draft.relationship
                      : profile.relationship
                  }
                  icon={<UsersRound size={17} />}
                  editing={editing}
                  onChange={(value) =>
                    updateField("relationship", value)
                  }
                />

                <ProfileField
                  label="City"
                  value={editing ? draft.city : profile.city}
                  icon={<MapPin size={17} />}
                  editing={editing}
                  onChange={(value) =>
                    updateField("city", value)
                  }
                />

                <ProfileField
                  label="Address"
                  value={editing ? draft.address : profile.address}
                  icon={<MapPin size={17} />}
                  editing={editing}
                  onChange={(value) =>
                    updateField("address", value)
                  }
                />
              </div>
            </section>

            {/* Emergency Contact */}
            <section className="rounded-2xl border border-[#E2DBD0] bg-white shadow-sm">
              <div className="border-b border-[#E8E1D7] p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EDEA] text-[#8A513B]">
                    <Phone size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8A8075]">
                      Emergency Contact
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      Someone we can reach
                    </h2>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
                <ProfileField
                  label="Contact Name"
                  value={
                    editing
                      ? draft.emergencyName
                      : profile.emergencyName
                  }
                  icon={<UserRound size={17} />}
                  editing={editing}
                  onChange={(value) =>
                    updateField("emergencyName", value)
                  }
                />

                <ProfileField
                  label="Phone Number"
                  value={
                    editing
                      ? draft.emergencyPhone
                      : profile.emergencyPhone
                  }
                  icon={<Phone size={17} />}
                  editing={editing}
                  type="tel"
                  onChange={(value) =>
                    updateField("emergencyPhone", value)
                  }
                />

                <ProfileField
                  label="Relationship"
                  value={
                    editing
                      ? draft.emergencyRelationship
                      : profile.emergencyRelationship
                  }
                  icon={<Heart size={17} />}
                  editing={editing}
                  onChange={(value) =>
                    updateField(
                      "emergencyRelationship",
                      value
                    )
                  }
                />
              </div>
            </section>

            {/* Account Security */}
            <section className="rounded-2xl border border-[#E2DBD0] bg-white shadow-sm">
              <div className="border-b border-[#E8E1D7] p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                    <LockKeyhole size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8A8075]">
                      Account Security
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      Keep your account secure
                    </h2>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-5 sm:p-6">
                <div className="flex flex-col gap-4 rounded-xl bg-[#FBF8F3] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="mt-1 text-xs text-[#8A8075]">
                      Last updated recently
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-fit rounded-xl border border-[#E2DBD0] bg-white px-4 py-2 text-sm font-medium text-[#6F5139] hover:bg-[#F3ECE3]"
                  >
                    Change Password
                  </button>
                </div>

                <div className="flex flex-col gap-4 rounded-xl bg-[#FBF8F3] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">
                      Two-factor authentication
                    </p>
                    <p className="mt-1 text-xs text-[#8A8075]">
                      Add an extra layer of account protection
                    </p>
                  </div>

                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#E8F0E9] px-3 py-1.5 text-xs font-medium text-[#58705A]">
                    <CheckCircle2 size={13} />
                    Enabled
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Verification */}
            <section className="rounded-2xl border border-[#DDE4DC] bg-[#F3F7F2] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#58705A]">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-[#4F6753]">
                    Account Verified
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-[#657267]">
                    Your family account is verified and ready to manage
                    senior care activities.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {[
                  "Email address verified",
                  "Phone number verified",
                  "Family account active",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-[#58705A]"
                  >
                    <CheckCircle2 size={15} />
                    {item}
                  </div>
                ))}
              </div>
            </section>

            {/* Connected Seniors */}
            <section className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#8A8075]">
                    Family
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Connected Seniors
                  </h2>
                </div>

                <Heart size={19} className="text-[#6F5139]" />
              </div>

              <div className="mt-5 space-y-3">
                <ProfileSenior
                  name="Mrs. Sharma"
                  relation="Mother"
                  location="Noida"
                  href="/family/seniors/1"
                />

                <ProfileSenior
                  name="Mr. Saxena"
                  relation="Father"
                  location="Delhi"
                  href="/family/seniors/2"
                />
              </div>

              <Link
                to="/family/seniors"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#6F5139]"
              >
                Manage seniors
                <ChevronRight size={15} />
              </Link>
            </section>

            {/* Preferences */}
            <section className="rounded-2xl border border-[#E2DBD0] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                  <Bell size={18} />
                </div>

                <div>
                  <h2 className="font-semibold">Preferences</h2>
                  <p className="mt-1 text-xs text-[#8A8075]">
                    Manage how EverSenior keeps you informed
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <PreferenceRow
                  title="Session updates"
                  description="Bookings and companion activity"
                  enabled
                />

                <PreferenceRow
                  title="Safety alerts"
                  description="Important wellbeing notifications"
                  enabled
                />

                <PreferenceRow
                  title="Payment updates"
                  description="Payments, refunds and invoices"
                  enabled
                />
              </div>

              <Link
                to="/family/settings"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#6F5139]"
              >
                Manage settings
                <ChevronRight size={15} />
              </Link>
            </section>

            {/* Quick links */}
            <section className="rounded-2xl border border-[#E2DBD0] bg-[#F3ECE3] p-5">
              <h2 className="font-semibold">Quick Links</h2>

              <div className="mt-4 space-y-2">
                <QuickLink
                  href="/family/safety"
                  icon={<ShieldCheck size={16} />}
                  label="Safety Center"
                />

                <QuickLink
                  href="/family/payments"
                  icon={<IndianRupeeIcon />}
                  label="Payments"
                />

                <QuickLink
                  href="/family/notifications"
                  icon={<Bell size={16} />}
                  label="Notifications"
                />

                <QuickLink
                  href="/family/settings"
                  icon={<LockKeyhole size={16} />}
                  label="Account Settings"
                />
              </div>
            </section>
          </div>
        </section>

        {/* Privacy */}
        <section className="mt-8 rounded-2xl border border-[#E2DBD0] bg-[#FBF8F3] p-5 sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#6F5139]">
                <LockKeyhole size={19} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Your information stays protected
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#756A60]">
                  Your personal details are used to manage your EverSenior
                  family account and coordinate care-related activities.
                </p>
              </div>
            </div>

            <Link
              to="/family/settings"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#D8CEC1] bg-white px-4 py-2.5 text-sm font-semibold text-[#6F5139] transition hover:bg-[#F3ECE3]"
            >
              Privacy Settings
              <ChevronRight size={16} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-[#E2DBD0] pt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#6F5139]">
            <Heart size={15} />
            <span>Care, trust and connection.</span>
          </div>

          <p className="mt-2 text-xs text-[#94887B]">
            EverSenior helps families stay connected with the people they care
            about.
          </p>
        </footer>
      </main>
    </div>
  );
}

type ProfileFieldProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  editing: boolean;
  type?: string;
  onChange: (value: string) => void;
};

function ProfileField({
  label,
  value,
  icon,
  editing,
  type = "text",
  onChange,
}: ProfileFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#8A8075]">
        {label}
      </label>

      {editing ? (
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8075]">
            {icon}
          </span>

          <input
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-xl border border-[#DED6CB] bg-[#FBF8F3] py-3 pl-10 pr-4 text-sm text-[#30271F] outline-none transition placeholder:text-[#A49A8E] focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10"
          />
        </div>
      ) : (
        <div className="flex min-h-[46px] items-center gap-3 rounded-xl bg-[#FBF8F3] px-3.5">
          <span className="text-[#8A8075]">{icon}</span>
          <span className="text-sm text-[#4F4841]">{value}</span>
        </div>
      )}
    </div>
  );
}

type ProfileSeniorProps = {
  name: string;
  relation: string;
  location: string;
  href: string;
};

function ProfileSenior({
  name,
  relation,
  location,
  href,
}: ProfileSeniorProps) {
  return (
    <Link
      to={href}
      className="flex items-center gap-3 rounded-xl border border-[#E7E0D7] bg-[#FBF8F3] p-3 transition hover:bg-[#F3ECE3]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6F5139] text-xs font-semibold text-white">
        {name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .slice(0, 2)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{name}</p>
        <p className="mt-0.5 text-xs text-[#8A8075]">
          {relation} · {location}
        </p>
      </div>

      <ChevronRight size={16} className="text-[#8A8075]" />
    </Link>
  );
}

type PreferenceRowProps = {
  title: string;
  description: string;
  enabled: boolean;
};

function PreferenceRow({
  title,
  description,
  enabled,
}: PreferenceRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-[#FBF8F3] p-3">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-[#8A8075]">
          {description}
        </p>
      </div>

      <span
        className={`relative h-6 w-11 rounded-full ${
          enabled ? "bg-[#6F5139]" : "bg-[#D5CEC4]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </span>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      to={href}
      className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-3 text-sm font-medium text-[#5F574F] transition hover:bg-[#FBF8F3]"
    >
      <span className="text-[#6F5139]">{icon}</span>

      <span className="flex-1">{label}</span>

      <ChevronRight size={15} className="text-[#94887B]" />
    </Link>
  );
}

function IndianRupeeIcon() {
  return <span className="text-sm font-bold">₹</span>;
}