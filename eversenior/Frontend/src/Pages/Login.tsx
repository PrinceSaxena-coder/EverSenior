import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, HeartHandshake, Users, Eye, EyeOff } from "lucide-react";

import { apiRequest } from "../api/client";

type Role = "eversenior" | "family" | "companion";

const seniorImage = "/images/eversenior-seniors.jpg";

const inputClass =
  "w-full rounded-xl border border-[#DDD6C8] bg-[#FCFBF8] px-4 py-3.5 text-[#30271F] placeholder-[#9B9287] outline-none transition focus:border-[#7A6048] focus:ring-2 focus:ring-[#7A6048]/10";

type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
};

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /*
   * If the user opens:
   *
   * /login?role=companion
   *
   * Companion will automatically be selected.
   */

  const initialRole: Role =
    searchParams.get("role") === "companion"
      ? "companion"
      : searchParams.get("role") === "family"
        ? "family"
        : "eversenior";

  const [role, setRole] = useState<Role>(initialRole);

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    const email = String(data.get("email") || "").trim();

    const password = String(data.get("password") || "");

    /*
     * Basic frontend validation.
     */

    if (!email || !password) {
      setError("Please enter your email and password.");

      return;
    }

    setError("");
    setIsLoading(true);

    try {
      /*
       * Send login request to NestJS backend.
       *
       * POST:
       * http://localhost:3000/v1/auth/login
       */

      const result = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",

        body: JSON.stringify({
          email,
          password,
        }),
      });

      /*
       * Store the REAL JWT returned
       * by the backend.
       */

      localStorage.setItem("accessToken", result.accessToken);

      /*
       * Keep these existing frontend
       * values so the current frontend
       * navigation continues working.
       */

      localStorage.setItem("isLoggedIn", "true");

      localStorage.setItem("userRole", role);

      localStorage.setItem("userEmail", result.user.email);

      localStorage.setItem("userId", result.user.id);

      /*
       * Store the backend role too.
       *
       * Example:
       * senior
       * family
       * companion
       */

      localStorage.setItem("backendRole", result.user.role);

      console.log("Backend login successful", {
        userId: result.user.id,
        email: result.user.email,
        role: result.user.role,
        user: result.user,
      });
      localStorage.setItem("backendRole", result.user.role);
      localStorage.setItem("backendUser", JSON.stringify(result.user));

      console.log("Backend login successful", result.user);

      /*
       * Navigate according to the
       * selected frontend role.
       */

      if (role === "companion") {
        navigate("/companion/dashboard");
      } else if (role === "family") {
        navigate("/family/dashboard");
      } else {
        navigate("/senior/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Unable to sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E7] px-4 py-6 sm:px-6 lg:px-8">
      {/* ===================================================== */}
      {/* MAIN AUTHENTICATION CONTAINER */}
      {/* ===================================================== */}

      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-[28px] border border-[#E3DBCE] bg-white shadow-[0_20px_60px_rgba(73,55,38,0.10)]">
        {/* ================================================= */}
        {/* LEFT IMAGE + BRAND PANEL */}
        {/* ================================================= */}

        <div className="relative hidden w-[46%] overflow-hidden bg-[#4C3B2E] lg:flex lg:flex-col">
          {/* Senior Image */}

          <img
            src={seniorImage}
            alt="Senior couple enjoying meaningful companionship"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Dark brown overlay */}

          <div className="absolute inset-0 bg-[#3B2C21]/75" />

          {/* Bottom gradient */}

          <div className="absolute inset-0 bg-gradient-to-t from-[#302219]/95 via-[#4C3B2E]/55 to-[#4C3B2E]/35" />

          {/* Decorative circles */}

          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#80674D]/20" />

          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#A88C6A]/10" />

          <div className="relative flex h-full flex-col justify-between p-12 xl:p-14">
            {/* ================================================= */}
            {/* BRAND + HERO */}
            {/* ================================================= */}

            <div>
              {/* Brand */}

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8D6B8] text-[#4C3B2E]">
                  <HeartHandshake size={23} strokeWidth={1.8} />
                </div>

                <div>
                  <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#F8F3EA]">
                    EverSenior
                  </h1>

                  <p className="mt-0.5 text-sm text-[#D9CDBC]">
                    Meaningful companionship
                  </p>
                </div>
              </div>

              {/* Hero Copy */}

              <div className="mt-24 max-w-md">
                <p className="mb-5 text-sm font-medium uppercase tracking-[0.18em] text-[#D9B985]">
                  Welcome to EverSenior
                </p>

                <h2 className="font-serif text-4xl font-semibold leading-[1.12] text-[#FBF7F0] xl:text-5xl">
                  Meaningful companionship,
                  <span className="text-[#D9B985]"> whenever you need it.</span>
                </h2>

                <p className="mt-7 max-w-sm text-base leading-7 text-[#D8CFC3]">
                  Connect with trusted companions who bring conversation,
                  comfort and meaningful moments into everyday life.
                </p>
              </div>
            </div>

            {/* ================================================= */}
            {/* TRUST POINTS */}
            {/* ================================================= */}

            <div className="space-y-5">
              {/* Trust 1 */}

              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6A5542] text-[#E8D6B8]">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <p className="text-sm font-medium text-[#F5EFE6]">
                    Safe & trusted community
                  </p>

                  <p className="mt-0.5 text-xs text-[#BFB2A2]">
                    A comfortable space for meaningful connections
                  </p>
                </div>
              </div>

              {/* Trust 2 */}

              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6A5542] text-[#E8D6B8]">
                  <Users size={18} />
                </div>

                <div>
                  <p className="text-sm font-medium text-[#F5EFE6]">
                    Thoughtfully matched companions
                  </p>

                  <p className="mt-0.5 text-xs text-[#BFB2A2]">
                    Find people who share your interests
                  </p>
                </div>
              </div>

              {/* Trust 3 */}

              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#6A5542] text-[#E8D6B8]">
                  <HeartHandshake size={18} />
                </div>

                <div>
                  <p className="text-sm font-medium text-[#F5EFE6]">
                    Built around companionship
                  </p>

                  <p className="mt-0.5 text-xs text-[#BFB2A2]">
                    More conversations. More connection. Less loneliness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* RIGHT LOGIN PANEL */}
        {/* ===================================================== */}

        <div className="flex w-full flex-col justify-center bg-white px-6 py-10 sm:px-10 lg:w-[54%] lg:px-14 xl:px-20">
          <div className="mx-auto w-full max-w-md">
            {/* Mobile Brand */}

            <div className="mb-10 text-center lg:hidden">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4C3B2E] text-[#E8D6B8]">
                <HeartHandshake size={24} />
              </div>

              <h1 className="font-serif text-3xl font-semibold text-[#4C3B2E]">
                EverSenior
              </h1>

              <p className="mt-2 text-sm text-[#81776B]">
                Meaningful companionship, whenever you need it.
              </p>
            </div>

            {/* Heading */}

            <div className="mb-8">
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#30271F] sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-2 text-[15px] text-[#81776B]">
                Sign in to continue your EverSenior journey.
              </p>
            </div>

            {/* ================================================= */}
            {/* ROLE DROPDOWN */}
            {/* ================================================= */}

            <div className="mb-7">
              <label
                htmlFor="role"
                className="mb-2.5 block text-sm font-medium text-[#40372F]"
              >
                I am signing in as
              </label>

              <div className="relative">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full appearance-none rounded-xl border border-[#DDD6C8] bg-[#FCFBF8] px-4 py-3.5 pr-12 text-[#30271F] outline-none transition focus:border-[#7A6048] focus:ring-2 focus:ring-[#7A6048]/10"
                >
                  <option value="eversenior">Senior</option>

                  <option value="family">Family Member</option>

                  <option value="companion">Companion</option>
                </select>

                {/* Dropdown Arrow */}

                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#897E72]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* FORM */}
            {/* ================================================= */}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#40372F]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  className={inputClass}
                />
              </div>

              {/* Password */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-[#40372F]"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-[#7A6048] transition hover:text-[#4C3B2E] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#897E72] transition hover:text-[#4C3B2E]"
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#CFC6B8] accent-[#6B513B]"
                />

                <label htmlFor="remember" className="text-sm text-[#766D63]">
                  Keep me signed in
                </label>
              </div>

              {/* Error */}

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-[#E7CFC1] bg-[#FBF3EE] px-4 py-3 text-sm text-[#9A6045]"
                >
                  {error}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={isLoading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#5A4432] py-3.5 font-medium text-white shadow-sm transition hover:bg-[#493627] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Sign in"}

                {!isLoading && (
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                )}
              </button>
            </form>

            {/* ================================================= */}
            {/* DIVIDER */}
            {/* ================================================= */}

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E8E1D7]" />

              <span className="text-xs font-medium text-[#AAA096]">OR</span>

              <div className="h-px flex-1 bg-[#E8E1D7]" />
            </div>

            {/* Google Login */}

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#DCD4C8] bg-white py-3.5 font-medium text-[#40372F] transition hover:bg-[#FAF8F4]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.95h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.25z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.54 13.58a5.86 5.86 0 0 1 0-3.16V7.89H3.3a9.5 9.5 0 0 0 0 8.22l3.24-2.53z"
                />

                <path
                  fill="#EA4335"
                  d="M12 6.39c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.48 14.62 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 8.11 9.46 6.39 12 6.39z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Signup */}

            <p className="mt-7 text-center text-sm text-[#81776B]">
              Don't have an account?{" "}
              <Link
                to={role === "companion" ? "/signup?role=companion" : "/signup"}
                className="font-semibold text-[#6B513B] hover:text-[#493627] hover:underline"
              >
                Create one
              </Link>
            </p>

            {/* Terms */}

            <p className="mt-8 text-center text-xs leading-5 text-[#A39A90]">
              By continuing, you agree to EverSenior's{" "}
              <Link to="/terms" className="underline hover:text-[#6B513B]">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-[#6B513B]">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
