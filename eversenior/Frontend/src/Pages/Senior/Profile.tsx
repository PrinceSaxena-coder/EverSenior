import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { Camera, Check, LoaderCircle } from "lucide-react";

import SeniorNavbar from "./SeniorNavbar";
import { apiRequest } from "../../api/client";

const interests = [
  "Reading",
  "Walking",
  "Music",
  "Travel",
  "Cooking",
  "Gardening",
  "Movies",
  "Art",
  "Technology",
  "Coffee & Conversation",
];

const inputClass =
  "w-full rounded-xl border border-[#DED7CC] bg-[#FCFBF8] px-4 py-3 text-sm text-[#30271F] outline-none transition focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10";

type SeniorProfile = {
  age?: number;
  city?: string;
  bio?: string;
  interests?: string[];
  hobbies?: string[];
  gender?: string;
};

type ProfileResponse = {
  type?: string;
  profile?: SeniorProfile;
};

type UserResponse = {
  user?: {
    name?: string;
    fullName?: string;
    email?: string;
    phone?: string;
  };
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Reading",
    "Walking",
    "Music",
    "Coffee & Conversation",
  ]);

  const [formData, setFormData] = useState({
    name: "Test Senior",
    email: "testsenior@example.com",
    phone: "",
    age: "",
    city: "",
    bio: "",
  });

  const [originalData, setOriginalData] = useState(formData);
  const [originalInterests, setOriginalInterests] =
    useState<string[]>(selectedInterests);

  // Load the logged-in user's profile from the backend.
  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        const [profileResult, userResult] = await Promise.all([
          apiRequest<ProfileResponse>("/profiles/me"),
          apiRequest<UserResponse>("/auth/me"),
        ]);

        if (!active) return;

        const profile = profileResult?.profile ?? {};
        const user = userResult?.user ?? userResult ?? {};

        const storedName = localStorage.getItem("userName") || "";

        const nextData = {
          name:
            user.fullName ||
            user.name ||
            storedName ||
            "Test Senior",
          email:
            user.email ||
            localStorage.getItem("userEmail") ||
            "testsenior@example.com",
          phone:
            user.phone ||
            localStorage.getItem("userPhone") ||
            "",
          age: profile.age != null ? String(profile.age) : "",
          city: profile.city || "",
          bio: profile.bio || "",
        };

        const nextInterests =
          profile.interests?.length
            ? profile.interests
            : profile.hobbies?.length
              ? profile.hobbies
              : [];

        setFormData(nextData);
        setOriginalData(nextData);
        setSelectedInterests(nextInterests);
        setOriginalInterests(nextInterests);

        localStorage.setItem("userName", nextData.name);
        localStorage.setItem("userEmail", nextData.email);

        if (nextData.phone) {
          localStorage.setItem("userPhone", nextData.phone);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load your profile. Please try again.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const profileInitial =
    formData.name.trim().charAt(0).toUpperCase() || "T";

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
    setError("");
  };

  const toggleInterest = (interest: string) => {
    if (!isEditing) return;

    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );

    setSaved(false);
  };

  // Save editable senior fields to the backend.
  async function handleSave() {
    const ageNumber = formData.age.trim()
      ? Number(formData.age)
      : undefined;

    if (
      ageNumber !== undefined &&
      (!Number.isInteger(ageNumber) || ageNumber < 1 || ageNumber > 120)
    ) {
      setError("Please enter a valid age between 1 and 120.");
      return;
    }

    setSaving(true);
    setError("");
    setSaved(false);

    try {
      await apiRequest("/profiles/me/senior", {
        method: "PUT",
        body: JSON.stringify({
          ...(ageNumber !== undefined ? { age: ageNumber } : {}),
          city: formData.city.trim(),
          bio: formData.bio.trim(),
          interests: selectedInterests,
        }),
      });

      // These fields are kept locally because the senior-profile
      // endpoint may not permit changing account identity details.
      localStorage.setItem("userName", formData.name.trim());
      localStorage.setItem("userEmail", formData.email.trim());

      if (formData.phone.trim()) {
        localStorage.setItem("userPhone", formData.phone.trim());
      }

      const updatedData = {
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        bio: formData.bio.trim(),
      };

      setFormData(updatedData);
      setOriginalData(updatedData);
      setOriginalInterests([...selectedInterests]);
      setIsEditing(false);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setFormData(originalData);
    setSelectedInterests(originalInterests);
    setIsEditing(false);
    setSaved(false);
    setError("");
  }

  const completedFields = [
    formData.name.trim(),
    formData.age.trim(),
    formData.city.trim(),
    formData.bio.trim(),
    formData.email.trim(),
  ].filter(Boolean).length;

  const profileStrength = Math.round((completedFields / 5) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
        <SeniorNavbar />
        <div className="flex min-h-[60vh] items-center justify-center gap-3">
          <LoaderCircle className="animate-spin" size={22} />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <SeniorNavbar />

      <main className="px-5 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-[1180px]">
          <section className="mb-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-[#8B654A]">
              Your account
            </p>

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <h1 className="font-serif text-4xl tracking-tight md:text-5xl">
                  My Profile
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#75695E] md:text-base">
                  Manage your personal information, interests and
                  preferences to make your EverSenior experience more
                  meaningful.
                </p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setSaved(false);
                    setError("");
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-[#6F5139] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5C432F]"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <section className="overflow-hidden rounded-[28px] border border-[#E2DBD0] bg-white shadow-sm">
            <div className="h-32 bg-[#6F5139] md:h-40" />

            <div className="px-5 pb-7 md:px-8">
              <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                  <div className="relative">
                    <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-full border-4 border-white bg-[#F3ECE3] text-3xl font-semibold text-[#6F5139] shadow-md">
                      {profileInitial}
                    </div>

                    {isEditing && (
                      <button
                        type="button"
                        disabled
                        aria-label="Change profile photo"
                        title="Profile photo upload is not connected yet"
                        className="absolute bottom-1 right-1 grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#6F5139] text-white shadow-sm"
                      >
                        <Camera size={16} />
                      </button>
                    )}
                  </div>

                  <div className="pb-1">
                    <h2 className="font-serif text-2xl md:text-3xl">
                      {formData.name}
                    </h2>

                    <p className="mt-1 text-sm text-[#817469]">
                      Senior Member
                      {formData.city ? ` · ${formData.city}` : ""}
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="rounded-full border border-[#DED7CC] bg-white px-5 py-3 text-sm font-medium text-[#6F5139] transition hover:bg-[#F8F4EE] disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleSave()}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-full bg-[#6F5139] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#5C432F] disabled:opacity-60"
                    >
                      {saving ? (
                        <LoaderCircle size={17} className="animate-spin" />
                      ) : (
                        <Check size={17} />
                      )}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              {saved && (
                <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#D9CDBF] bg-[#F6F1EA] px-4 py-3 text-sm text-[#6F5139]">
                  <Check size={17} />
                  Your profile has been saved to the backend.
                </div>
              )}
            </div>
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_0.8fr]">
            <section className="rounded-[28px] border border-[#E2DBD0] bg-white p-5 shadow-sm md:p-7">
              <div className="mb-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8B654A]">
                  About you
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-[#817469]">
                  Keep your personal details up to date.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="age" className="mb-2 block text-sm font-medium">
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                    Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="city" className="mb-2 block text-sm font-medium">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bio" className="mb-2 block text-sm font-medium">
                    About me
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#817469]">
                Name, email and phone are currently saved in this browser.
                Age, city, bio and interests are sent to the backend.
              </p>
            </section>

            <div className="space-y-6">
              <section className="rounded-[28px] border border-[#E2DBD0] bg-white p-6 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8B654A]">
                  Profile
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  Profile strength
                </h2>

                <span className="mt-3 block text-lg font-semibold text-[#6F5139]">
                  {profileStrength}%
                </span>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EEE8DF]">
                  <div
                    className="h-full rounded-full bg-[#6F5139] transition-all"
                    style={{ width: `${profileStrength}%` }}
                  />
                </div>

                <p className="mt-4 text-xs leading-5 text-[#817469]">
                  Complete your personal details to make your profile more
                  useful for companion matching.
                </p>
              </section>

              <section className="rounded-[28px] border border-[#E2DBD0] bg-white p-6 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8B654A]">
                  Membership
                </p>

                <h2 className="mt-2 font-serif text-2xl">Account</h2>

                <p className="mt-1 text-sm text-[#817469]">
                  Your EverSenior membership.
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-[#817469]">
                    Account status
                  </span>

                  <span className="rounded-full bg-[#F3ECE3] px-3 py-1 text-xs font-medium text-[#6F5139]">
                    Active
                  </span>
                </div>
              </section>
            </div>
          </div>

          <section className="mt-6 rounded-[28px] border border-[#E2DBD0] bg-white p-5 shadow-sm md:p-7">
            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8B654A]">
                Discover connections
              </p>

              <h2 className="mt-2 font-serif text-2xl">My Interests</h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#817469]">
                Choose interests that help us find companions who share
                the things you enjoy.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {interests.map((interest) => {
                const selected = selectedInterests.includes(interest);

                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    disabled={!isEditing}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      selected
                        ? "border-[#6F5139] bg-[#6F5139] text-white"
                        : "border-[#DED7CC] bg-[#FCFBF8] text-[#665B52]"
                    } ${
                      isEditing
                        ? "cursor-pointer hover:border-[#6F5139]"
                        : "cursor-default"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>

            {!isEditing && (
              <p className="mt-5 text-xs text-[#999086]">
                Select "Edit Profile" to update your interests.
              </p>
            )}
          </section>

          <div className="mt-6 rounded-2xl border border-[#E2DBD0] bg-[#F3ECE3] px-5 py-4">
            <p className="text-sm leading-6 text-[#6E6258]">
              <span className="font-medium text-[#30271F]">
                Your privacy matters.
              </span>{" "}
              Your personal information should only be shared with verified
              EverSenior companions when necessary for your experience.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}