import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  ShieldCheck,
  CreditCard,
  Building2,
  GraduationCap,
  BriefcaseBusiness,
  FileText,
  Upload,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Pencil,
  LockKeyhole,
  IndianRupee,
  Landmark,
  BadgeCheck,
  BookOpen,
  X,
} from "lucide-react";

import CompanionNavbar from "./CompanionNavbar";

type Section =
  | "personal"
  | "identity"
  | "payment"
  | "documents";

type UploadedFile = {
  name: string;
  uploaded: boolean;
};

export default function Profile() {
  const [activeSection, setActiveSection] =
    useState<Section>("personal");

  const [editing, setEditing] =
    useState(false);

  const [showAccountNumber, setShowAccountNumber] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  /* =====================================================
     PERSONAL INFORMATION
  ===================================================== */

  const [personal, setPersonal] = useState({
    firstName:
      localStorage.getItem("userName") ||
      "Ananya",

    lastName: "Sharma",

    email:
      localStorage.getItem("userEmail") ||
      "ananya@example.com",

    phone:
      localStorage.getItem("userPhone") ||
      "+91 98765 43210",

    dateOfBirth: "12 August 2004",

    gender: "Female",

    city: "Noida",

    state: "Uttar Pradesh",

    address:
      "Sector 62, Noida, Uttar Pradesh",

    emergencyContact:
      "+91 98765 12345",
  });

  /* =====================================================
     IDENTITY + PROFESSIONAL
  ===================================================== */

  const [identity, setIdentity] = useState({
    aadhaarNumber: "",

    panNumber: "",

    college:
      "XYZ University, Noida",

    degree:
      "Bachelor of Technology",

    course:
      "Computer Science & Engineering",

    year:
      "2nd Year",

    graduationYear:
      "2028",

    collegeCity:
      "Noida",

    skills:
      "Communication, Technology, Senior Care, Basic First Aid",

    experience:
      "1 year",

    previousExperience:
      "Volunteer companionship and community activities",

    languages:
      "English, Hindi, Hinglish",
  });

  /* =====================================================
     PAYMENT
  ===================================================== */

  const [payment, setPayment] = useState({
    accountHolder:
      "Ananya Sharma",

    bankName:
      "State Bank of India",

    accountNumber:
      "",

    confirmAccountNumber:
      "",

    ifsc:
      "",

    upi:
      "",
  });

  /* =====================================================
     DOCUMENTS
  ===================================================== */

  const [documents, setDocuments] =
    useState<Record<string, UploadedFile>>({
      tenth: {
        name: "",
        uploaded: false,
      },

      twelfth: {
        name: "",
        uploaded: false,
      },

      collegeReceipt: {
        name: "",
        uploaded: false,
      },

      aadhaar: {
        name: "",
        uploaded: false,
      },

      pan: {
        name: "",
        uploaded: false,
      },
    });

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = () => {
    localStorage.setItem(
      "userName",
      `${personal.firstName} ${personal.lastName}`
    );

    localStorage.setItem(
      "userEmail",
      personal.email
    );

    localStorage.setItem(
      "userPhone",
      personal.phone
    );

    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  /* =====================================================
     DOCUMENT UPLOAD
  ===================================================== */

  const handleDocumentUpload = (
    key: string,
    file: File | undefined
  ) => {
    if (!file) return;

    setDocuments((current) => ({
      ...current,
      [key]: {
        name: file.name,
        uploaded: true,
      },
    }));
  };

  /* =====================================================
     REMOVE DOCUMENT
  ===================================================== */

  const removeDocument = (
    key: string
  ) => {
    setDocuments((current) => ({
      ...current,
      [key]: {
        name: "",
        uploaded: false,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">

      <CompanionNavbar />

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="border-b border-[#E2DBD0] bg-white">

        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="mb-2 text-sm font-semibold text-[#7A624C]">
                Companion account
              </p>

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3ECE3] text-[#6F5139]">
                  <User size={23} />
                </div>

                <div>

                  <h1 className="text-2xl font-semibold tracking-tight text-[#30271F] sm:text-3xl">
                    My Profile
                  </h1>

                  <p className="mt-1 text-sm text-[#76695C]">
                    Manage your personal information,
                    verification and payment details.
                  </p>

                </div>

              </div>

            </div>

            <div className="flex items-center gap-3">

              {saved && (
                <div className="flex items-center gap-2 rounded-xl bg-[#EDF7EF] px-4 py-2.5 text-sm font-medium text-[#47714E]">
                  <CheckCircle2
                    size={16}
                  />
                  Changes saved
                </div>
              )}

              <button
                onClick={() => {
                  if (editing) {
                    handleSave();
                  } else {
                    setEditing(true);
                  }
                }}
                className="flex items-center gap-2 rounded-xl bg-[#6F5139] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5F4633]"
              >
                {editing ? (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Pencil size={16} />
                    Edit Profile
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          PROFILE COMPLETION
      ================================================= */}

      <section className="border-b border-[#E2DBD0] bg-[#F7F3EC]">

        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">

          <div className="rounded-2xl border border-[#E3DBD1] bg-white p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <BadgeCheck
                    size={18}
                    className="text-[#6F5139]"
                  />

                  <p className="text-sm font-semibold text-[#40362E]">
                    Profile completion
                  </p>

                </div>

                <p className="mt-1 text-xs text-[#807265]">
                  Complete your profile to receive
                  more suitable session opportunities.
                </p>

              </div>

              <span className="text-lg font-semibold text-[#6F5139]">
                72%
              </span>

            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EEE8DF]">

              <div
                className="h-full rounded-full bg-[#6F5139]"
                style={{
                  width: "72%",
                }}
              />

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8 lg:py-9">

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside>

            <div className="sticky top-24 rounded-2xl border border-[#E3DBD1] bg-white p-2">

              <ProfileSectionButton
                active={
                  activeSection ===
                  "personal"
                }
                icon={
                  <User size={18} />
                }
                title="Personal Information"
                description="Basic details"
                onClick={() =>
                  setActiveSection(
                    "personal"
                  )
                }
              />

              <ProfileSectionButton
                active={
                  activeSection ===
                  "identity"
                }
                icon={
                  <ShieldCheck
                    size={18}
                  />
                }
                title="Identity & Professional"
                description="KYC & education"
                onClick={() =>
                  setActiveSection(
                    "identity"
                  )
                }
              />

              <ProfileSectionButton
                active={
                  activeSection ===
                  "payment"
                }
                icon={
                  <CreditCard
                    size={18}
                  />
                }
                title="Payment Details"
                description="Bank & UPI"
                onClick={() =>
                  setActiveSection(
                    "payment"
                  )
                }
              />

              <ProfileSectionButton
                active={
                  activeSection ===
                  "documents"
                }
                icon={
                  <FileText
                    size={18}
                  />
                }
                title="Documents & KYC"
                description="Upload documents"
                onClick={() =>
                  setActiveSection(
                    "documents"
                  )
                }
              />

            </div>

          </aside>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="min-w-0">

            {activeSection ===
              "personal" && (
              <PersonalInformation
                data={personal}
                editing={editing}
                setData={setPersonal}
              />
            )}

            {activeSection ===
              "identity" && (
              <IdentityProfessional
                data={identity}
                editing={editing}
                setData={setIdentity}
              />
            )}

            {activeSection ===
              "payment" && (
              <PaymentDetails
                data={payment}
                editing={editing}
                setData={setPayment}
                showAccountNumber={
                  showAccountNumber
                }
                setShowAccountNumber={
                  setShowAccountNumber
                }
              />
            )}

            {activeSection ===
              "documents" && (
              <DocumentsKYC
                documents={documents}
                onUpload={
                  handleDocumentUpload
                }
                onRemove={
                  removeDocument
                }
              />
            )}

          </div>

        </div>

      </main>

    </div>
  );
}

/* =========================================================
   SECTION BUTTON
========================================================= */

function ProfileSectionButton({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
        active
          ? "bg-[#F3ECE3] text-[#6F5139]"
          : "text-[#65594E] hover:bg-[#FBF9F6]"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          active
            ? "bg-white"
            : "bg-[#F7F3EC]"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">

        <p className="truncate text-sm font-semibold">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[11px] text-[#8A7B6D]">
          {description}
        </p>

      </div>
    </button>
  );
}

/* =========================================================
   PERSONAL INFORMATION
========================================================= */

function PersonalInformation({
  data,
  editing,
  setData,
}: {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    city: string;
    state: string;
    address: string;
    emergencyContact: string;
  };
  editing: boolean;
  setData: React.Dispatch<
    React.SetStateAction<typeof data>
  >;
}) {
  return (
    <ProfileCard
      icon={<User size={19} />}
      title="Personal Information"
      description="Your basic personal and contact information."
    >

      <div className="grid gap-5 sm:grid-cols-2">

        <InputField
          label="First Name"
          value={data.firstName}
          disabled={!editing}
          onChange={(value) =>
            setData((current) => ({
              ...current,
              firstName: value,
            }))
          }
        />

        <InputField
          label="Last Name"
          value={data.lastName}
          disabled={!editing}
          onChange={(value) =>
            setData((current) => ({
              ...current,
              lastName: value,
            }))
          }
        />

        <InputField
          label="Email Address"
          value={data.email}
          disabled={!editing}
          icon={<Mail size={16} />}
          onChange={(value) =>
            setData((current) => ({
              ...current,
              email: value,
            }))
          }
        />

        <InputField
          label="Phone Number"
          value={data.phone}
          disabled={!editing}
          icon={<Phone size={16} />}
          onChange={(value) =>
            setData((current) => ({
              ...current,
              phone: value,
            }))
          }
        />

        <InputField
          label="Date of Birth"
          value={data.dateOfBirth}
          disabled={!editing}
          icon={
            <CalendarDays size={16} />
          }
          onChange={(value) =>
            setData((current) => ({
              ...current,
              dateOfBirth: value,
            }))
          }
        />

        <SelectField
          label="Gender"
          value={data.gender}
          disabled={!editing}
          options={[
            "Female",
            "Male",
            "Prefer not to say",
          ]}
          onChange={(value) =>
            setData((current) => ({
              ...current,
              gender: value,
            }))
          }
        />

        <InputField
          label="City"
          value={data.city}
          disabled={!editing}
          icon={
            <MapPin size={16} />
          }
          onChange={(value) =>
            setData((current) => ({
              ...current,
              city: value,
            }))
          }
        />

        <InputField
          label="State"
          value={data.state}
          disabled={!editing}
          onChange={(value) =>
            setData((current) => ({
              ...current,
              state: value,
            }))
          }
        />

      </div>

      <div className="mt-5">

        <InputField
          label="Current Address"
          value={data.address}
          disabled={!editing}
          onChange={(value) =>
            setData((current) => ({
              ...current,
              address: value,
            }))
          }
        />

      </div>

      <div className="mt-5">

        <InputField
          label="Emergency Contact"
          value={data.emergencyContact}
          disabled={!editing}
          icon={
            <Phone size={16} />
          }
          onChange={(value) =>
            setData((current) => ({
              ...current,
              emergencyContact: value,
            }))
          }
        />

      </div>

      <InfoBox
        icon={<LockKeyhole size={16} />}
        text="Your personal information is used for account management, safety and companion verification."
      />

    </ProfileCard>
  );
}

/* =========================================================
   IDENTITY & PROFESSIONAL
========================================================= */

function IdentityProfessional({
  data,
  editing,
  setData,
}: {
  data: {
    aadhaarNumber: string;
    panNumber: string;
    college: string;
    degree: string;
    course: string;
    year: string;
    graduationYear: string;
    collegeCity: string;
    skills: string;
    experience: string;
    previousExperience: string;
    languages: string;
  };
  editing: boolean;
  setData: React.Dispatch<
    React.SetStateAction<typeof data>
  >;
}) {
  return (
    <div className="space-y-6">

      {/* Identity */}

      <ProfileCard
        icon={
          <ShieldCheck size={19} />
        }
        title="Identity Verification"
        description="Government identity details required for KYC verification."
      >

        <div className="grid gap-5 sm:grid-cols-2">

          <InputField
            label="Aadhaar Number"
            value={
              data.aadhaarNumber
            }
            disabled={!editing}
            placeholder="XXXX XXXX XXXX"
            onChange={(value) =>
              setData((current) => ({
                ...current,
                aadhaarNumber: value,
              }))
            }
          />

          <InputField
            label="PAN Number"
            value={
              data.panNumber
            }
            disabled={!editing}
            placeholder="ABCDE1234F"
            onChange={(value) =>
              setData((current) => ({
                ...current,
                panNumber: value,
              }))
            }
          />

        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#DCEBDD] bg-[#F3F9F4] p-4">

          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-[#4F8B5D]"
          />

          <div>

            <p className="text-sm font-semibold text-[#3F6646]">
              KYC verification
            </p>

            <p className="mt-1 text-xs leading-5 text-[#647867]">
              Your identity documents will be
              securely reviewed before your
              companion account is fully activated.
            </p>

          </div>

        </div>

      </ProfileCard>

      {/* Education */}

      <ProfileCard
        icon={
          <GraduationCap size={19} />
        }
        title="Education"
        description="Tell us about your current education and academic background."
      >

        <div className="grid gap-5 sm:grid-cols-2">

          <InputField
            label="College / University"
            value={data.college}
            disabled={!editing}
            icon={
              <Building2 size={16} />
            }
            onChange={(value) =>
              setData((current) => ({
                ...current,
                college: value,
              }))
            }
          />

          <InputField
            label="Degree"
            value={data.degree}
            disabled={!editing}
            icon={
              <GraduationCap
                size={16}
              />
            }
            onChange={(value) =>
              setData((current) => ({
                ...current,
                degree: value,
              }))
            }
          />

          <InputField
            label="Course / Specialisation"
            value={data.course}
            disabled={!editing}
            icon={
              <BookOpen size={16} />
            }
            onChange={(value) =>
              setData((current) => ({
                ...current,
                course: value,
              }))
            }
          />

          <InputField
            label="Current Year"
            value={data.year}
            disabled={!editing}
            onChange={(value) =>
              setData((current) => ({
                ...current,
                year: value,
              }))
            }
          />

          <InputField
            label="Expected Graduation Year"
            value={
              data.graduationYear
            }
            disabled={!editing}
            onChange={(value) =>
              setData((current) => ({
                ...current,
                graduationYear: value,
              }))
            }
          />

          <InputField
            label="College City"
            value={data.collegeCity}
            disabled={!editing}
            icon={
              <MapPin size={16} />
            }
            onChange={(value) =>
              setData((current) => ({
                ...current,
                collegeCity: value,
              }))
            }
          />

        </div>

      </ProfileCard>

      {/* Professional */}

      <ProfileCard
        icon={
          <BriefcaseBusiness
            size={19}
          />
        }
        title="Professional Skills"
        description="Information used to understand your strengths and match suitable sessions."
      >

        <div className="space-y-5">

          <TextAreaField
            label="Skills"
            value={data.skills}
            disabled={!editing}
            placeholder="Communication, technology, hobbies..."
            onChange={(value) =>
              setData((current) => ({
                ...current,
                skills: value,
              }))
            }
          />

          <InputField
            label="Companion Experience"
            value={data.experience}
            disabled={!editing}
            onChange={(value) =>
              setData((current) => ({
                ...current,
                experience: value,
              }))
            }
          />

          <TextAreaField
            label="Previous Experience"
            value={
              data.previousExperience
            }
            disabled={!editing}
            placeholder="Describe relevant experience..."
            onChange={(value) =>
              setData((current) => ({
                ...current,
                previousExperience:
                  value,
              }))
            }
          />

          <InputField
            label="Languages Spoken"
            value={data.languages}
            disabled={!editing}
            icon={
              <BookOpen size={16} />
            }
            onChange={(value) =>
              setData((current) => ({
                ...current,
                languages: value,
              }))
            }
          />

        </div>

      </ProfileCard>

    </div>
  );
}

/* =========================================================
   PAYMENT
========================================================= */

function PaymentDetails({
  data,
  editing,
  setData,
  showAccountNumber,
  setShowAccountNumber,
}: {
  data: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    confirmAccountNumber: string;
    ifsc: string;
    upi: string;
  };
  editing: boolean;
  setData: React.Dispatch<
    React.SetStateAction<typeof data>
  >;
  showAccountNumber: boolean;
  setShowAccountNumber: (
    value: boolean
  ) => void;
}) {
  return (
    <ProfileCard
      icon={
        <CreditCard size={19} />
      }
      title="Payment Details"
      description="Add the account details where your companion earnings will be transferred."
    >

      <div className="rounded-xl border border-[#E4DDD3] bg-[#FBF9F6] p-4">

        <div className="flex items-start gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3ECE3] text-[#6F5139]">
            <IndianRupee
              size={17}
            />
          </div>

          <div>

            <p className="text-sm font-semibold text-[#40362E]">
              Earnings account
            </p>

            <p className="mt-1 text-xs leading-5 text-[#76695C]">
              This account will be used to
              receive payments for completed
              companionship sessions.
            </p>

          </div>

        </div>

      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">

        <InputField
          label="Account Holder Name"
          value={data.accountHolder}
          disabled={!editing}
          icon={
            <User size={16} />
          }
          onChange={(value) =>
            setData((current) => ({
              ...current,
              accountHolder: value,
            }))
          }
        />

        <InputField
          label="Bank Name"
          value={data.bankName}
          disabled={!editing}
          icon={
            <Landmark size={16} />
          }
          onChange={(value) =>
            setData((current) => ({
              ...current,
              bankName: value,
            }))
          }
        />

        <div>

          <label className="mb-2 block text-xs font-semibold text-[#65594E]">
            Account Number
          </label>

          <div className="relative">

            <input
              type={
                showAccountNumber
                  ? "text"
                  : "password"
              }
              value={
                data.accountNumber
              }
              disabled={!editing}
              placeholder="Enter account number"
              onChange={(event) =>
                setData((current) => ({
                  ...current,
                  accountNumber:
                    event.target.value,
                }))
              }
              className="h-11 w-full rounded-xl border border-[#DED5CA] bg-white px-3 pr-11 text-sm text-[#40362E] outline-none transition placeholder:text-[#B0A397] focus:border-[#9C7C60] disabled:bg-[#F8F5F1] disabled:text-[#807469]"
            />

            <button
              type="button"
              onClick={() =>
                setShowAccountNumber(
                  !showAccountNumber
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87796C]"
            >
              {showAccountNumber ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>

          </div>

        </div>

        <InputField
          label="Confirm Account Number"
          value={
            data.confirmAccountNumber
          }
          disabled={!editing}
          type="password"
          onChange={(value) =>
            setData((current) => ({
              ...current,
              confirmAccountNumber:
                value,
            }))
          }
        />

        <InputField
          label="IFSC Code"
          value={data.ifsc}
          disabled={!editing}
          placeholder="SBIN0000000"
          onChange={(value) =>
            setData((current) => ({
              ...current,
              ifsc: value,
            }))
          }
        />

        <InputField
          label="UPI ID"
          value={data.upi}
          disabled={!editing}
          placeholder="name@upi"
          onChange={(value) =>
            setData((current) => ({
              ...current,
              upi: value,
            }))
          }
        />

      </div>

      <InfoBox
        icon={<LockKeyhole size={16} />}
        text="Banking information should only be stored and transmitted through a secure backend in production. This frontend is currently a prototype."
      />

    </ProfileCard>
  );
}

/* =========================================================
   DOCUMENTS + KYC
========================================================= */

function DocumentsKYC({
  documents,
  onUpload,
  onRemove,
}: {
  documents: Record<
    string,
    UploadedFile
  >;
  onUpload: (
    key: string,
    file: File | undefined
  ) => void;
  onRemove: (key: string) => void;
}) {
  return (
    <div className="space-y-6">

      {/* KYC STATUS */}

      <ProfileCard
        icon={
          <ShieldCheck size={19} />
        }
        title="KYC Verification"
        description="Track the status of your identity and document verification."
      >

        <div className="rounded-2xl border border-[#E2DBD1] bg-[#FBF9F6] p-5">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F8F0E2] text-[#9A7443]">
                <Clock3
                  size={20}
                />
              </div>

              <div>

                <p className="text-sm font-semibold text-[#40362E]">
                  KYC Verification Pending
                </p>

                <p className="mt-1 text-xs text-[#7C6E61]">
                  Your documents are being prepared
                  for verification.
                </p>

              </div>

            </div>

            <span className="w-fit rounded-full bg-[#F8F0E2] px-3 py-1.5 text-xs font-semibold text-[#8A693C]">
              Pending
            </span>

          </div>

          <div className="mt-5 border-t border-[#E5DDD3] pt-4">

            <div className="grid gap-4 sm:grid-cols-3">

              <VerificationStatus
                label="Identity"
                status="Pending"
              />

              <VerificationStatus
                label="Education"
                status="Pending"
              />

              <VerificationStatus
                label="Bank"
                status="Pending"
              />

            </div>

          </div>

        </div>

      </ProfileCard>

      {/* DOCUMENT UPLOADS */}

      <ProfileCard
        icon={
          <FileText size={19} />
        }
        title="Required Documents"
        description="Upload clear and readable copies of the documents required for companion verification."
      >

        <div className="space-y-4">

          <DocumentUpload
            title="10th Marksheet"
            description="Upload your Class 10 marksheet."
            document={
              documents.tenth
            }
            onUpload={(file) =>
              onUpload(
                "tenth",
                file
              )
            }
            onRemove={() =>
              onRemove("tenth")
            }
          />

          <DocumentUpload
            title="12th Marksheet"
            description="Upload your Class 12 marksheet."
            document={
              documents.twelfth
            }
            onUpload={(file) =>
              onUpload(
                "twelfth",
                file
              )
            }
            onRemove={() =>
              onRemove("twelfth")
            }
          />

          <DocumentUpload
            title="Current College Admission / Fee Receipt"
            description="Proof that you are currently admitted to your college or university."
            document={
              documents.collegeReceipt
            }
            onUpload={(file) =>
              onUpload(
                "collegeReceipt",
                file
              )
            }
            onRemove={() =>
              onRemove(
                "collegeReceipt"
              )
            }
          />

          <DocumentUpload
            title="Aadhaar Card"
            description="Upload the identity document used for KYC."
            document={
              documents.aadhaar
            }
            onUpload={(file) =>
              onUpload(
                "aadhaar",
                file
              )
            }
            onRemove={() =>
              onRemove("aadhaar")
            }
          />

          <DocumentUpload
            title="PAN Card"
            description="Upload your PAN card for identity and payment verification."
            document={
              documents.pan
            }
            onUpload={(file) =>
              onUpload(
                "pan",
                file
              )
            }
            onRemove={() =>
              onRemove("pan")
            }
          />

        </div>

      </ProfileCard>

      {/* SECURITY NOTICE */}

      <div className="rounded-2xl border border-[#E3DBD1] bg-[#F3ECE3] p-5">

        <div className="flex items-start gap-3">

          <LockKeyhole
            size={18}
            className="mt-0.5 shrink-0 text-[#6F5139]"
          />

          <div>

            <p className="text-sm font-semibold text-[#40362E]">
              Your documents are sensitive
            </p>

            <p className="mt-1 text-xs leading-5 text-[#76695C]">
              Aadhaar, PAN, educational documents
              and banking information should be
              encrypted and securely stored in the
              production backend. Never store these
              documents directly in browser
              localStorage.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   DOCUMENT UPLOAD
========================================================= */

function DocumentUpload({
  title,
  description,
  document,
  onUpload,
  onRemove,
}: {
  title: string;
  description: string;
  document: UploadedFile;
  onUpload: (
    file: File | undefined
  ) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#E3DBD1] bg-white p-4">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex min-w-0 items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F3ECE3] text-[#6F5139]">
            <FileText size={18} />
          </div>

          <div className="min-w-0">

            <p className="text-sm font-semibold text-[#40362E]">
              {title}
            </p>

            <p className="mt-1 text-xs leading-5 text-[#827468]">
              {description}
            </p>

            {document.uploaded && (
              <div className="mt-2 flex items-center gap-2">

                <CheckCircle2
                  size={14}
                  className="shrink-0 text-[#4F8B5D]"
                />

                <span className="truncate text-xs font-medium text-[#4F7655]">
                  {document.name}
                </span>

              </div>
            )}

          </div>

        </div>

        <div className="shrink-0">

          {document.uploaded ? (
            <button
              onClick={onRemove}
              className="flex items-center gap-2 rounded-lg border border-[#E1D8CE] px-3 py-2 text-xs font-semibold text-[#8B5A4A] transition hover:bg-[#F8EFEB]"
            >
              <X size={14} />
              Remove
            </button>
          ) : (
            <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#6F5139] px-3.5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5F4633]">
              <Upload size={14} />
              Upload

              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) => {
                  onUpload(
                    event.target
                      .files?.[0]
                  );

                  event.currentTarget.value =
                    "";
                }}
              />
            </label>
          )}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   VERIFICATION STATUS
========================================================= */

function VerificationStatus({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  return (
    <div className="flex items-center gap-2">

      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F8F0E2] text-[#9A7443]">
        <Clock3 size={13} />
      </div>

      <div>
        <p className="text-xs font-semibold text-[#51463D]">
          {label}
        </p>

        <p className="text-[10px] text-[#968779]">
          {status}
        </p>
      </div>

    </div>
  );
}

/* =========================================================
   PROFILE CARD
========================================================= */

function ProfileCard({
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
    <section className="overflow-hidden rounded-2xl border border-[#E3DBD1] bg-white">

      <div className="border-b border-[#E8E1D8] px-5 py-5 sm:px-6">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
            {icon}
          </div>

          <div>

            <h2 className="text-base font-semibold text-[#30271F] sm:text-lg">
              {title}
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#7D7063] sm:text-sm">
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

/* =========================================================
   INPUT
========================================================= */

function InputField({
  label,
  value,
  disabled,
  onChange,
  placeholder,
  icon,
  type = "text",
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  type?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-[#65594E]">
        {label}
      </label>

      <div className="relative">

        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#998A7B]">
            {icon}
          </span>
        )}

        <input
          type={type}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className={`h-11 w-full rounded-xl border border-[#DED5CA] bg-white text-sm text-[#40362E] outline-none transition placeholder:text-[#B0A397] focus:border-[#9C7C60] ${
            icon
              ? "pl-10 pr-3"
              : "px-3"
          } ${
            disabled
              ? "cursor-default bg-[#F8F5F1] text-[#716458]"
              : ""
          }`}
        />

      </div>

    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

function SelectField({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-[#65594E]">
        {label}
      </label>

      <select
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="h-11 w-full rounded-xl border border-[#DED5CA] bg-white px-3 text-sm text-[#40362E] outline-none focus:border-[#9C7C60] disabled:bg-[#F8F5F1]"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

    </div>
  );
}

/* =========================================================
   TEXT AREA
========================================================= */

function TextAreaField({
  label,
  value,
  disabled,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-[#65594E]">
        {label}
      </label>

      <textarea
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        rows={3}
        className="w-full resize-none rounded-xl border border-[#DED5CA] bg-white px-3 py-3 text-sm leading-6 text-[#40362E] outline-none placeholder:text-[#B0A397] focus:border-[#9C7C60] disabled:bg-[#F8F5F1]"
      />

    </div>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#E5DDD3] bg-[#F7F3EC] p-4">

      <span className="mt-0.5 shrink-0 text-[#806B56]">
        {icon}
      </span>

      <p className="text-xs leading-5 text-[#76695C]">
        {text}
      </p>

    </div>
  );
}