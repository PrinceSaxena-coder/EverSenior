import { useEffect, useRef, useState, type ReactNode } from "react";

import {
  Bell,
  BriefcaseBusiness,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  FileText,
  GraduationCap,
  Headphones,
  IdCard,
  Languages,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Moon,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
  Ticket,
  User,
  Wallet,
  X,
  XCircle,
  Settings,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

/* =========================================================
   TYPES
========================================================= */

type VerificationStatus =
  | "idle"
  | "requesting"
  | "checking"
  | "success"
  | "error";

type NavIcon = typeof LayoutDashboard;

type OnboardingStage =
  | "psychometric"
  | "interview"
  | "background"
  | "police"
  | "onboarded";

const ONBOARDING_KEYS = {
  psychometric: "companionPsychometricStatus",
  interview: "companionInterviewStatus",
  background: "companionBackgroundStatus",
  police: "companionPoliceStatus",
} as const;

const ONBOARDING_ROUTES: Record<
  Exclude<OnboardingStage, "onboarded">,
  string
> = {
  psychometric: "/companion/psychometric-test",
  interview: "/companion/personal-interview",
  background: "/companion/background-verification",
  police: "/companion/police-verification",
};

const getOnboardingStage = (): OnboardingStage => {
  try {
    if (localStorage.getItem(ONBOARDING_KEYS.police) === "passed") return "onboarded";
    if (localStorage.getItem(ONBOARDING_KEYS.background) === "passed") return "police";
    if (localStorage.getItem(ONBOARDING_KEYS.interview) === "passed") return "background";
    if (localStorage.getItem(ONBOARDING_KEYS.psychometric) === "passed") return "interview";
  } catch {}
  return "psychometric";
};

export const completeCompanionOnboardingStage = (
  stage: Exclude<OnboardingStage, "onboarded">
) => {
  localStorage.setItem(ONBOARDING_KEYS[stage], "passed");
  window.dispatchEvent(new Event("companion-onboarding-updated"));
};

export const failCompanionOnboarding = () => {
  Object.values(ONBOARDING_KEYS).forEach((key) => localStorage.setItem(key, "pending"));
  localStorage.setItem("companionOnline", "false");
  localStorage.removeItem("companionVerificationStatus");
  localStorage.removeItem("companionVerifiedAt");
  window.dispatchEvent(new Event("companion-onboarding-updated"));
};

/* =========================================================
   CONSTANTS
========================================================= */

const LANGUAGES = [
  "English",
  "Hindi",
  "Hinglish",
  "Punjabi",
  "Bengali",
  "Marathi",
];

/*
  Backend endpoint for real face verification.

  Expected request:

  POST /api/companion/verify-face

  multipart/form-data:

  image     -> captured camera image
  userEmail -> logged-in companion email

  Expected response:

  {
    verified: true,
    message: "Face verified successfully"
  }
*/

const FACE_VERIFICATION_ENDPOINT = "/api/companion/verify-face";

/* =========================================================
   MAIN NAVBAR
========================================================= */

export default function CompanionNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  /* =======================================================
     GENERAL STATE
  ======================================================= */

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const [languageOpen, setLanguageOpen] = useState(false);

  const [online, setOnline] = useState<boolean>(() => {
    try {
      return localStorage.getItem("companionOnline") === "true";
    } catch {
      return false;
    }
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    try {
      return localStorage.getItem("companionLanguage") || "English";
    } catch {
      return "English";
    }
  });

  const [onboardingStage, setOnboardingStage] = useState<OnboardingStage>(() =>
    getOnboardingStage()
  );

  useEffect(() => {
    const refreshOnboarding = () => {
      setOnboardingStage(getOnboardingStage());
    };

    refreshOnboarding();
    window.addEventListener("companion-onboarding-updated", refreshOnboarding);

    return () => {
      window.removeEventListener(
        "companion-onboarding-updated",
        refreshOnboarding
      );
    };
  }, [location.pathname]);

  /* =======================================================
     VERIFICATION STATE
  ======================================================= */

  const [verificationOpen, setVerificationOpen] = useState(false);

  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("idle");

  const [verificationError, setVerificationError] = useState("");

  /*
    Camera reference.

    IMPORTANT:
    Do NOT type this as RefObject<HTMLVideoElement | null>
    because your current React typings are expecting a
    different LegacyRef type.

    This simple object works with the callback ref below.
  */

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  /* =======================================================
     CAMERA CLEANUP
  ======================================================= */

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  /* =======================================================
     START CAMERA
  ======================================================= */

  const startCamera = async () => {
    try {
      setVerificationStatus("requesting");
      setVerificationError("");

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported by this browser.");
      }

      /*
        Stop any previous camera stream.
      */
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: {
            ideal: 720,
          },
          height: {
            ideal: 720,
          },
        },
        audio: false,
      });

      streamRef.current = stream;

      /*
        The modal should already be mounted here.
      */
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
        } catch (error) {
          console.warn("Video autoplay was blocked:", error);
        }
      }

      setVerificationStatus("idle");
    } catch (error) {
      console.error("Camera permission error:", error);

      setVerificationStatus("error");

      if (
        error instanceof DOMException &&
        error.name === "NotAllowedError"
      ) {
        setVerificationError(
          "Camera permission was denied. Please allow camera access in your browser and try again."
        );
      } else if (
        error instanceof DOMException &&
        error.name === "NotFoundError"
      ) {
        setVerificationError("No camera was found on this device.");
      } else {
        setVerificationError(
          error instanceof Error
            ? error.message
            : "Unable to access your camera."
        );
      }
    }
  };

  /* =======================================================
     OPEN VERIFICATION
  ======================================================= */

  const openVerification = () => {
    setVerificationError("");
    setVerificationStatus("requesting");
    setVerificationOpen(true);
  };

  /* =======================================================
     START CAMERA AFTER MODAL MOUNTS
  ======================================================= */

  useEffect(() => {
    if (!verificationOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      startCamera();
    }, 150);

    return () => {
      window.clearTimeout(timer);
    };
  }, [verificationOpen]);

  /* =======================================================
     CLOSE VERIFICATION
  ======================================================= */

  const closeVerification = () => {
    stopCamera();

    setVerificationOpen(false);
    setVerificationStatus("idle");
    setVerificationError("");
  };

  /* =======================================================
     CAPTURE CURRENT VIDEO FRAME
  ======================================================= */

  const captureFaceImage = async (): Promise<Blob> => {
    const video = videoRef.current;

    if (!video) {
      throw new Error("Camera preview is not available.");
    }

    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      throw new Error(
        "Camera is still starting. Please wait a moment and try again."
      );
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      throw new Error("Unable to capture the camera image.");
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to process camera image.");
    }

    /*
      Mirror the captured image.
    */
    context.translate(canvas.width, 0);
    context.scale(-1, 1);

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Could not create verification image."));
            return;
          }

          resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    });
  };

  /* =======================================================
     REAL FACE VERIFICATION
  ======================================================= */

  const verifyAndGoOnline = async () => {
    if (verificationStatus === "checking") {
      return;
    }

    try {
      setVerificationStatus("checking");
      setVerificationError("");

      /*
        Capture current camera frame.
      */
      const faceImage = await captureFaceImage();

      /*
        Logged-in companion email.
      */
      const userEmail = localStorage.getItem("userEmail") || "";

      if (!userEmail) {
        throw new Error("Could not find your account. Please log in again.");
      }

      /*
        Build multipart request.
      */
      const formData = new FormData();

      formData.append("image", faceImage, "companion-face.jpg");

      formData.append("userEmail", userEmail);

      /*
        Send image to backend.
      */
      const response = await fetch(FACE_VERIFICATION_ENDPOINT, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      let result: {
        verified?: boolean;
        message?: string;
      } = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        throw new Error(result.message || "Face verification failed.");
      }

      /*
        ONLY verified=true can make the
        companion online.
      */
      if (result.verified !== true) {
        throw new Error(
          result.message ||
            "Your face could not be verified. Please try again."
        );
      }

      /* ================================================
         SAVE VERIFIED STATE
      ================================================= */

      localStorage.setItem("companionOnline", "true");

      localStorage.setItem("companionVerificationStatus", "verified");

      localStorage.setItem("companionVerifiedAt", new Date().toISOString());

      /* ================================================
         UPDATE UI
      ================================================= */

      setOnline(true);
      setVerificationStatus("success");

      stopCamera();

      window.setTimeout(() => {
        setVerificationOpen(false);
        setVerificationStatus("idle");
      }, 900);
    } catch (error) {
      console.error("Face verification error:", error);

      setVerificationStatus("error");

      setVerificationError(
        error instanceof Error
          ? error.message
          : "Identity verification failed. Please try again."
      );
    }
  };

  /* =======================================================
     LANGUAGE
  ======================================================= */

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);

    try {
      localStorage.setItem("companionLanguage", language);
    } catch {}

    setLanguageOpen(false);
  };

  /* =======================================================
     ONLINE / OFFLINE
  ======================================================= */

  const handleOnlineToggle = () => {
    if (online) {
      localStorage.setItem("companionOnline", "false");
      localStorage.removeItem("companionVerificationStatus");
      localStorage.removeItem("companionVerifiedAt");
      setOnline(false);
      return;
    }

    const currentStage = getOnboardingStage();

    if (currentStage !== "onboarded") {
      navigate(ONBOARDING_ROUTES[currentStage]);
      setProfileOpen(false);
      setMobileMenuOpen(false);
      return;
    }

    openVerification();
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");

    localStorage.removeItem("companionOnline");

    localStorage.removeItem("companionVerificationStatus");

    localStorage.removeItem("companionVerifiedAt");

    setOnline(false);
    setProfileOpen(false);
    setMobileMenuOpen(false);
    setLanguageOpen(false);

    stopCamera();

    navigate("/login");
  };

  /* =======================================================
     ACTIVE ROUTE
  ======================================================= */

  const isActive = (path: string) => {
    if (path === "/companion/dashboard") {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  /* =======================================================
     DESKTOP NAV ITEM
  ======================================================= */

  const NavItem = ({
    to,
    icon: Icon,
    children,
  }: {
    to: string;
    icon: NavIcon;
    children: ReactNode;
  }) => {
    const active = isActive(to);

    return (
      <Link
        to={to}
        className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
          active
            ? "bg-bark text-white"
            : "text-ink/70 hover:bg-cream-dark hover:text-bark"
        }`}
      >
        <Icon size={17} />
        {children}
      </Link>
    );
  };

  /* =======================================================
     MOBILE NAV ITEM
  ======================================================= */

  const MobileNavItem = ({
    to,
    icon: Icon,
    children,
  }: {
    to: string;
    icon: NavIcon;
    children: ReactNode;
  }) => {
    const active = isActive(to);

    return (
      <Link
        to={to}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
          active ? "bg-bark text-white" : "text-ink hover:bg-cream-dark"
        }`}
      >
        <Icon size={18} />
        {children}
      </Link>
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 w-full border-b border-bark/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-5 md:px-8 lg:px-10">
          {/* LOGO */}

          <Link
            to="/companion/dashboard"
            className="flex shrink-0 items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bark text-white">
              <HeartIcon />
            </div>

            <div className="hidden sm:block">
              <p className="text-[17px] font-bold tracking-tight text-ink">
                EverSenior
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-bark">
                Companion
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav className="hidden items-center gap-1 lg:flex">
            <NavItem to="/companion/dashboard" icon={LayoutDashboard}>
              Home
            </NavItem>

            <NavItem to="/companion/explore" icon={BriefcaseBusiness}>
              Explore
            </NavItem>

            <NavItem to="/companion/sessions" icon={ShoppingBag}>
              My Sessions
            </NavItem>

            <NavItem to="/companion/pocket" icon={Wallet}>
              Pocket
            </NavItem>

            <NavItem to="/companion/messages" icon={Headphones}>
              Messages
            </NavItem>
          </nav>

          {/* DESKTOP CONTROLS */}

          <div className="hidden items-center gap-2 lg:flex">
            {/* LANGUAGE */}

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLanguageOpen((previous) => !previous);

                  setProfileOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-cream-dark hover:text-bark"
              >
                <Languages size={17} />

                <span>{selectedLanguage}</span>

                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    languageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {languageOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-bark/10 bg-white p-1.5 shadow-xl">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => handleLanguageChange(language)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        selectedLanguage === language
                          ? "bg-cream font-semibold text-bark"
                          : "text-ink hover:bg-cream-dark"
                      }`}
                    >
                      {language}

                      {selectedLanguage === language && <Check size={15} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* NOTIFICATIONS */}

            <Link
              to="/companion/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink/70 transition hover:bg-cream-dark hover:text-bark"
            >
              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Link>

            {/* ONLINE / OFFLINE */}

            <button
              type="button"
              onClick={handleOnlineToggle}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                online
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "border-bark/20 bg-cream text-bark hover:bg-bark hover:text-white"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  online ? "bg-emerald-500" : "bg-bark/40"
                }`}
              />

              {online ? "Online" : "Go Online"}
            </button>

            {/* PROFILE */}

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((previous) => !previous);

                  setLanguageOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-cream-dark"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-bark">
                  <User size={18} />
                </div>

                <ChevronDown
                  size={15}
                  className={`text-ink/50 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <ProfileDropdown
                  navigate={navigate}
                  onboardingStage={onboardingStage}
                  onLogout={handleLogout}
                  onClose={() => setProfileOpen(false)}
                />
              )}
            </div>
          </div>

          {/* MOBILE BUTTON */}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((previous) => !previous)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink transition hover:bg-cream-dark lg:hidden"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* MOBILE MENU */}

        {mobileMenuOpen && (
          <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-bark/10 bg-white px-4 py-4 lg:hidden">
            <div className="mx-auto max-w-xl space-y-1">
              <MobileNavItem to="/companion/dashboard" icon={LayoutDashboard}>
                Home
              </MobileNavItem>

              <MobileNavItem to="/companion/explore" icon={BriefcaseBusiness}>
                Explore
              </MobileNavItem>

              <MobileNavItem to="/companion/sessions" icon={ShoppingBag}>
                My Sessions
              </MobileNavItem>

              <MobileNavItem to="/companion/pocket" icon={Wallet}>
                Pocket
              </MobileNavItem>

              <MobileNavItem to="/companion/messages" icon={Headphones}>
                Messages
              </MobileNavItem>

              <MobileNavItem to="/companion/notifications" icon={Bell}>
                Notifications
              </MobileNavItem>

              <div className="my-3 h-px bg-bark/10" />

              {/* MOBILE ONLINE */}

              <button
                type="button"
                onClick={() => {
                  handleOnlineToggle();
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                  online
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-bark/20 bg-cream text-bark"
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    online ? "bg-emerald-500" : "bg-bark/40"
                  }`}
                />

                {online ? "Online" : "Go Online"}
              </button>

              <div className="my-3 h-px bg-bark/10" />

              <MobileNavItem to="/companion/profile" icon={User}>
                My Profile
              </MobileNavItem>

              <MobileNavItem to="/companion/help" icon={CircleHelp}>
                Help Centre
              </MobileNavItem>

              <MobileNavItem to="/companion/settings" icon={Settings}>
                Settings
              </MobileNavItem>

              <div className="my-3 h-px bg-bark/10" />

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================
          VERIFICATION MODAL
      ====================================================== */}

      {verificationOpen && (
        <VerificationModal
          videoRef={videoRef}
          streamRef={streamRef}
          status={verificationStatus}
          errorMessage={verificationError}
          onVerify={verifyAndGoOnline}
          onClose={closeVerification}
          onRetry={() => {
            stopCamera();

            setVerificationError("");
            setVerificationStatus("requesting");

            window.setTimeout(() => {
              startCamera();
            }, 150);
          }}
        />
      )}
    </>
  );
}

/* =========================================================
   PROFILE DROPDOWN
========================================================= */

function ProfileDropdown({
  navigate,
  onboardingStage,
  onLogout,
  onClose,
}: {
  navigate: ReturnType<typeof useNavigate>;
  onboardingStage: OnboardingStage;
  onLogout: () => void;
  onClose: () => void;
}) {
  const go = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-3 w-[330px] max-h-[calc(100vh-90px)] overflow-y-auto rounded-2xl border border-bark/10 bg-white shadow-2xl">
      <div className="border-b border-bark/10 px-5 py-4">
        <p className="text-sm font-bold text-ink">Companion Account</p>

        <p className="mt-1 text-xs text-ink/50">
          Manage your profile and support
        </p>
      </div>

      <div className="p-2">
        <DropdownSection title="Work">
          <DropdownLink
            icon={BriefcaseBusiness}
            label="Explore"
            onClick={() => go("/companion/explore")}
          />

          <DropdownLink
            icon={ShoppingBag}
            label="My Sessions"
            onClick={() => go("/companion/sessions")}
          />

          <DropdownLink
            icon={Wallet}
            label="Pocket"
            onClick={() => go("/companion/pocket")}
          />

          <DropdownLink
            icon={User}
            label="My Profile"
            onClick={() => go("/companion/profile")}
          />
        </DropdownSection>

        <DropdownDivider />

        <DropdownSection title="Support">
          <DropdownLink
            icon={CircleHelp}
            label="Help Centre"
            onClick={() => go("/companion/help")}
          />

          <DropdownLink
            icon={Phone}
            label="Call Customer Care"
            onClick={() => {
              window.location.href = "tel:18001234567";
            }}
          />

          <DropdownLink
            icon={Ticket}
            label="My Tickets"
            onClick={() => go("/companion/my-tickets")}
          />
        </DropdownSection>

        <DropdownDivider />

        <DropdownSection title="Onboarding">
          <OnboardingDropdownItem
            number="01"
            label="Psychometric Test"
            stage="psychometric"
            currentStage={onboardingStage}
            icon={ShieldCheck}
            onClick={() =>
              onboardingStage === "psychometric" &&
              go(ONBOARDING_ROUTES.psychometric)
            }
          />

          <OnboardingDropdownItem
            number="02"
            label="Personal Interview"
            stage="interview"
            currentStage={onboardingStage}
            icon={User}
            onClick={() =>
              onboardingStage === "interview" &&
              go(ONBOARDING_ROUTES.interview)
            }
          />

          <OnboardingDropdownItem
            number="03"
            label="Background Verification"
            stage="background"
            currentStage={onboardingStage}
            icon={FileText}
            onClick={() =>
              onboardingStage === "background" &&
              go(ONBOARDING_ROUTES.background)
            }
          />

          <OnboardingDropdownItem
            number="04"
            label="Police Verification"
            stage="police"
            currentStage={onboardingStage}
            icon={ShieldCheck}
            onClick={() =>
              onboardingStage === "police" && go(ONBOARDING_ROUTES.police)
            }
          />

          <OnboardingDropdownItem
            number="✓"
            label="Onboarded"
            stage="onboarded"
            currentStage={onboardingStage}
            icon={CheckCircle2}
            onClick={() => {}}
          />
        </DropdownSection>

        <DropdownDivider />

        <DropdownSection title="Growth & Wellness">

          <DropdownLink
            icon={GraduationCap}
            label="Online Training"
            onClick={() => go("/companion/training")}
          />

          <DropdownLink
            icon={Stethoscope}
            label="Medical Services"
            onClick={() => go("/companion/medical-services")}
          />

          <DropdownLink
            icon={ShieldCheck}
            label="Medical Insurance"
            onClick={() => go("/companion/medical-insurance")}
          />
        </DropdownSection>

        <DropdownDivider />

        <DropdownSection title="Documents">
          <DropdownLink
            icon={IdCard}
            label="ID Card"
            onClick={() => go("/companion/id-card")}
          />

          <DropdownLink
            icon={FileText}
            label="Agreement"
            onClick={() => go("/companion/agreement")}
          />
        </DropdownSection>

        <DropdownDivider />

        <DropdownLink
          icon={Languages}
          label="Language Settings"
          onClick={() => go("/companion/language")}
        />

        <DropdownLink
          icon={Moon}
          label="Dark / Light Mode"
          onClick={() => {
            const current = localStorage.getItem("companionTheme");

            localStorage.setItem(
              "companionTheme",
              current === "dark" ? "light" : "dark"
            );

            window.location.reload();
          }}
        />

        <DropdownDivider />

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   ONBOARDING DROPDOWN ITEM
========================================================= */

function OnboardingDropdownItem({
  number,
  label,
  stage,
  currentStage,
  icon: Icon,
  onClick,
}: {
  number: string;
  label: string;
  stage: OnboardingStage;
  currentStage: OnboardingStage;
  icon: NavIcon;
  onClick: () => void;
}) {
  const order: OnboardingStage[] = [
    "psychometric",
    "interview",
    "background",
    "police",
    "onboarded",
  ];

  const stageIndex = order.indexOf(stage);
  const currentIndex = order.indexOf(currentStage);
  const completed = stageIndex < currentIndex;
  const current = stageIndex === currentIndex;
  const locked = stageIndex > currentIndex;

  return (
    <button
      type="button"
      disabled={locked || stage === "onboarded"}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
        locked ? "cursor-not-allowed opacity-40" : "hover:bg-cream"
      }`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          completed
            ? "bg-emerald-100 text-emerald-700"
            : current
              ? "bg-bark text-white"
              : "bg-cream text-ink/40"
        }`}
      >
        {completed ? (
          <Check size={15} />
        ) : (
          <span className="text-[10px] font-bold">{number}</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="mt-0.5 text-[10px] text-ink/40">
          {completed
            ? "Completed"
            : current
              ? "Current stage"
              : "Complete previous stage first"}
        </p>
      </div>

      {current && stage !== "onboarded" && (
        <span className="rounded-full bg-cream px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-bark">
          Current
        </span>
      )}

      {stage === "onboarded" && currentStage === "onboarded" && (
        <CheckCircle2 size={17} className="shrink-0 text-emerald-600" />
      )}
    </button>
  );
}

/* =========================================================
   DROPDOWN SECTION
========================================================= */

function DropdownSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="px-1 py-1">
      <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-ink/35">
        {title}
      </p>

      {children}
    </div>
  );
}

/* =========================================================
   DROPDOWN LINK
========================================================= */

function DropdownLink({
  icon: Icon,
  label,
  onClick,
}: {
  icon: NavIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink/75 transition hover:bg-cream hover:text-bark"
    >
      <Icon size={17} />

      <span>{label}</span>
    </button>
  );
}

/* =========================================================
   DROPDOWN DIVIDER
========================================================= */

function DropdownDivider() {
  return <div className="my-2 h-px bg-bark/10" />;
}

/* =========================================================
   VERIFICATION MODAL
========================================================= */

function VerificationModal({
  videoRef,
  streamRef,
  status,
  errorMessage,
  onVerify,
  onClose,
  onRetry,
}: {
  /*
    IMPORTANT FIX:

    We do NOT use:
    RefObject<HTMLVideoElement | null>

    Instead we use this simple ref object type.
  */

  videoRef: {
    current: HTMLVideoElement | null;
  };

  streamRef: {
    current: MediaStream | null;
  };

  status: VerificationStatus;

  errorMessage: string;

  onVerify: () => void;

  onClose: () => void;

  onRetry: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[500px] overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-bark/10 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-ink">
              Companion Verification
            </h2>

            <p className="mt-1 text-sm text-ink/50">
              Verify your identity before going online
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={status === "checking"}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-ink/50 transition hover:bg-cream disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-6">
          {/* REQUESTING */}

          {status === "requesting" && (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-2xl bg-cream">
              <Loader2 size={34} className="animate-spin text-bark" />

              <p className="mt-4 text-sm font-semibold text-ink">
                Starting camera...
              </p>

              <p className="mt-1 text-xs text-ink/50">
                Please allow camera access.
              </p>
            </div>
          )}

          {/* ERROR */}

          {status === "error" && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-red-50 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <XCircle size={34} className="text-red-500" />
              </div>

              <h3 className="mt-4 text-base font-bold text-ink">
                Verification Failed
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-ink/55">
                {errorMessage || "We could not verify your identity."}
              </p>

              <button
                type="button"
                onClick={onRetry}
                className="mt-5 rounded-xl bg-bark px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-bark/90"
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={onClose}
                className="mt-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-ink/60 transition hover:bg-white"
              >
                Cancel
              </button>
            </div>
          )}

          {/* CAMERA */}

          {(status === "idle" || status === "checking") && (
            <>
              <div className="relative overflow-hidden rounded-2xl bg-black">
                <video
                  /*
                    IMPORTANT TYPESCRIPT FIX

                    Instead of:

                    ref={videoRef}

                    use a callback ref.

                    The stream is only attached when the element does not
                    already show it, so re-renders do not restart the camera.
                  */
                  ref={(element) => {
                    videoRef.current = element;

                    if (
                      element &&
                      streamRef.current &&
                      element.srcObject !== streamRef.current
                    ) {
                      element.srcObject = streamRef.current;

                      element.play().catch((error) => {
                        console.warn("Video playback could not start:", error);
                      });
                    }
                  }}
                  autoPlay
                  muted
                  playsInline
                  className="h-[300px] w-full object-cover [transform:scaleX(-1)]"
                />

                {/* FACE GUIDE */}

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-52 w-40 rounded-[45%] border-2 border-white/90 shadow-[0_0_0_999px_rgba(0,0,0,0.25)]" />
                </div>

                {/* CAMERA STATUS */}

                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  Camera Active
                </div>

                {/* VERIFYING */}

                {status === "checking" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65">
                    <Loader2 size={40} className="animate-spin text-white" />

                    <p className="mt-4 text-sm font-semibold text-white">
                      Verifying identity...
                    </p>

                    <p className="mt-2 text-xs text-white/70">
                      Please keep your face visible.
                    </p>
                  </div>
                )}
              </div>

              {/* INFORMATION */}

              <div className="mt-5 rounded-2xl bg-cream px-4 py-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-bark">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-ink">
                      Identity Verification
                    </p>

                    <p className="mt-1 text-xs leading-5 text-ink/55">
                      Position your face inside the frame and look directly at
                      the camera.
                    </p>

                    <p className="mt-2 text-[11px] leading-4 text-ink/45">
                      Your camera is used only for identity verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* BUTTONS */}

              <div className="mt-5">
                <button
                  type="button"
                  onClick={onVerify}
                  disabled={status === "checking"}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-bark px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-bark/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "checking" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Camera size={18} />
                      Verify & Go Online
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={status === "checking"}
                  className="mt-2 w-full rounded-xl px-4 py-3 text-sm font-semibold text-ink/60 transition hover:bg-cream disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {/* SUCCESS */}

          {status === "success" && (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 size={42} className="text-emerald-500" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-ink">
                Identity Verified
              </h3>

              <p className="mt-2 text-sm text-ink/55">
                You are now online and can receive new sessions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HEART ICON
========================================================= */

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}