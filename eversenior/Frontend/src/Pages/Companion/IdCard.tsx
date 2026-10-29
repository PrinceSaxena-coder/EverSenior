
import { useState } from "react";
import { Link } from "react-router-dom";
import CompanionNavbar from "./CompanionNavbar";

export default function IDCardAssets() {
  const [cardSide, setCardSide] = useState<"front" | "back">("front");
  const [activeTab, setActiveTab] = useState<"id" | "tshirt">("id");

  // Replace these sample values with the logged-in companion's API data.
  const companion = {
    name: "Your Name",
    id: "ES-C-0001",
    status: "Pending Verification",
    joiningDate: "To be confirmed",
    photo: "",
  };

  return (
    <>
      <CompanionNavbar />

      <main className="min-h-screen bg-[#FAF6F0] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          <header className="mb-8 mt-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A07856]">
              EVERSENIOR COMPANION PORTAL
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#4E342E] sm:text-4xl">
              ID Card & Assets
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-[#6D5D53]">
              View your companion identity card and branded T-shirt.
              Your official identity details will be available after
              verification and approval.
            </p>
          </header>

          {/* Page tabs */}
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("id")}
              className={`rounded-xl px-5 py-3 font-semibold ${
                activeTab === "id"
                  ? "bg-[#795548] text-white"
                  : "border border-[#E4D5C7] bg-white text-[#795548]"
              }`}
            >
              My ID Card
            </button>

            <button
              onClick={() => setActiveTab("tshirt")}
              className={`rounded-xl px-5 py-3 font-semibold ${
                activeTab === "tshirt"
                  ? "bg-[#795548] text-white"
                  : "border border-[#E4D5C7] bg-white text-[#795548]"
              }`}
            >
              My T-shirt
            </button>
          </div>

          {activeTab === "id" && (
            <section className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-[#4E342E]">
                    Companion Identity Card
                  </h2>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCardSide("front")}
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        cardSide === "front"
                          ? "bg-[#795548] text-white"
                          : "border border-[#E4D5C7] bg-white text-[#795548]"
                      }`}
                    >
                      Front
                    </button>

                    <button
                      onClick={() => setCardSide("back")}
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        cardSide === "back"
                          ? "bg-[#795548] text-white"
                          : "border border-[#E4D5C7] bg-white text-[#795548]"
                      }`}
                    >
                      Back
                    </button>
                  </div>
                </div>

                {/* ID card preview */}
                <div
                  id="companion-id-card"
                  className="relative mx-auto aspect-[1.586/1] w-full max-w-[560px] overflow-hidden rounded-3xl border border-[#D7C0A8] bg-[#F7EDE0] p-5 shadow-xl sm:p-8"
                >
                  <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#E8D4BC]" />
                  <div className="absolute -bottom-20 -left-8 h-48 w-48 rounded-full bg-[#EADBC8]" />

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-center justify-between gap-3 border-b border-[#D9C3AB] pb-3">
                      <div>
                        <p className="text-xl font-extrabold tracking-wide text-[#4E342E] sm:text-2xl">
                          EverSenior
                        </p>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-[#795548] sm:text-xs">
                          Companionship with care
                        </p>
                      </div>

                      <span className="rounded-full border border-[#B69A7C] px-3 py-1 text-[9px] font-bold tracking-widest text-[#795548] sm:text-xs">
                        COMPANION
                      </span>
                    </div>

                    {cardSide === "front" ? (
                      <div className="flex flex-1 items-center gap-4 py-4 sm:gap-7">
                        <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-[#D0B89F] bg-[#E7D5C1] sm:h-32 sm:w-28">
                          {companion.photo ? (
                            <img
                              src={companion.photo}
                              alt="Companion profile"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-4xl text-[#795548]">
                              ♙
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="text-[9px] font-semibold uppercase tracking-widest text-[#95765C] sm:text-xs">
                            Trusted Companion
                          </p>

                          <h3 className="mt-2 break-words text-xl font-extrabold text-[#4E342E] sm:text-3xl">
                            {companion.name}
                          </h3>

                          <p className="mt-2 text-xs text-[#795548] sm:text-sm">
                            ID: {companion.id}
                          </p>

                          <span className="mt-3 inline-block rounded-full border border-[#B69A7C] bg-white/60 px-3 py-1 text-[9px] font-semibold text-[#795548] sm:text-xs">
                            {companion.status}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-1 items-center justify-between gap-4 py-4">
                        <div className="max-w-[70%]">
                          <h3 className="text-sm font-extrabold leading-5 text-[#4E342E] sm:text-xl">
                            EVERY SENIOR DESERVES COMPANIONSHIP
                          </h3>

                          <div className="mt-4 space-y-2 text-xs text-[#6D5140] sm:text-sm">
                            <p>
                              <strong>Name:</strong> {companion.name}
                            </p>
                            <p>
                              <strong>Companion ID:</strong> {companion.id}
                            </p>
                            <p>
                              <strong>Joining date:</strong>{" "}
                              {companion.joiningDate}
                            </p>
                            <p>
                              <strong>Verification:</strong> {companion.status}
                            </p>
                          </div>

                          <p className="mt-4 text-[9px] text-[#795548] sm:text-xs">
                            Website: www.eversenior.in
                          </p>
                        </div>

                        <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-lg border border-[#C8B096] bg-white p-2 text-center sm:h-24 sm:w-24">
                          <span className="text-2xl">▦</span>
                          <span className="mt-1 text-[8px] text-[#795548]">
                            QR placeholder
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-[#D9C3AB] pt-3 text-[9px] text-[#795548] sm:text-xs">
                      <span>EVERY CONNECTION MATTERS</span>
                      <span>EVERSENIOR</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => window.print()}
                    className="rounded-xl bg-[#795548] px-5 py-3 font-semibold text-white hover:bg-[#634439]"
                  >
                    Print ID Card
                  </button>

                  <button
                    onClick={() =>
                      setCardSide(cardSide === "front" ? "back" : "front")
                    }
                    className="rounded-xl border border-[#D8C3AF] bg-white px-5 py-3 font-semibold text-[#795548]"
                  >
                    View {cardSide === "front" ? "Back" : "Front"}
                  </button>
                </div>

                <p className="mt-4 text-xs leading-5 text-[#8D776A]">
                  This is a design preview, not an official identity document.
                  The QR area is a placeholder and is not scannable.
                </p>
              </div>

              {/* Companion details */}
              <aside className="rounded-2xl border border-[#E9DED2] bg-white p-6">
                <h2 className="text-xl font-bold text-[#4E342E]">
                  Your Card Details
                </h2>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-sm text-[#8D776A]">Companion Name</p>
                    <p className="mt-1 font-semibold text-[#4E342E]">
                      {companion.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#8D776A]">Unique ID</p>
                    <p className="mt-1 font-semibold text-[#4E342E]">
                      {companion.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-[#8D776A]">Verification Status</p>
                    <p className="mt-1 font-semibold text-[#795548]">
                      {companion.status}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-[#F7EFE7] p-4">
                  <p className="font-semibold text-[#4E342E]">
                    Official ID activation
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#6D5D53]">
                    Your official card should be issued only after your
                    identity has been verified and your companion profile
                    has received final approval.
                  </p>
                </div>
              </aside>
            </section>
          )}

          {activeTab === "tshirt" && (
            <section className="grid items-center gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border border-[#E9DED2] bg-white p-6 sm:p-10">
                <h2 className="text-xl font-bold text-[#4E342E]">
                  EverSenior Companion T-shirt
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#6D5D53]">
                  Branded apparel for approved EverSenior companions.
                </p>

                <div className="mt-6 flex justify-center rounded-2xl bg-[#F7EFE7] p-6">
                  <svg
                    viewBox="0 0 320 330"
                    role="img"
                    aria-label="Illustration of a brown EverSenior companion T-shirt"
                    className="w-full max-w-[300px]"
                  >
                    <defs>
                      <linearGradient id="shirtColor" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#896451" />
                        <stop offset="100%" stopColor="#5B4032" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M105 38 L132 24 Q160 48 188 24 L215 38 L277 72 L247 130 L216 113 L216 294 Q160 309 104 294 L104 113 L73 130 L43 72 Z"
                      fill="url(#shirtColor)"
                      stroke="#4E342E"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M132 25 Q160 70 188 25"
                      fill="none"
                      stroke="#D8BDA2"
                      strokeWidth="4"
                    />

                    <text
                      x="160"
                      y="145"
                      textAnchor="middle"
                      fill="#F7EDE0"
                      fontSize="21"
                      fontWeight="bold"
                    >
                      EverSenior
                    </text>

                    <path
                      d="M119 158 Q160 170 201 158"
                      fill="none"
                      stroke="#D8BDA2"
                      strokeWidth="2"
                    />

                    <text
                      x="160"
                      y="180"
                      textAnchor="middle"
                      fill="#F7EDE0"
                      fontSize="9"
                      letterSpacing="2"
                    >
                      COMPANION
                    </text>

                    <text
                      x="160"
                      y="265"
                      textAnchor="middle"
                      fill="#EAD7C4"
                      fontSize="9"
                      letterSpacing="1"
                    >
                      TRUST • CARE • CONNECTION
                    </text>
                  </svg>
                </div>

                <p className="mt-4 text-center text-xs text-[#8D776A]">
                  Illustrative T-shirt preview. Confirm the approved production
                  design before printing.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#4E342E]">
                  Your Companion Uniform
                </h2>

                <p className="mt-3 leading-7 text-[#6D5D53]">
                  The EverSenior T-shirt helps identify companions during
                  approved visits and creates a consistent, professional
                  appearance for the service.
                </p>

                <div className="mt-6 rounded-2xl border border-[#E9DED2] bg-white p-6">
                  <h3 className="font-bold text-[#4E342E]">
                    Asset information
                  </h3>

                  <div className="mt-4 space-y-3 text-sm text-[#6D5D53]">
                    <p>
                      <strong>Asset:</strong> Companion T-shirt
                    </p>
                    <p>
                      <strong>Brand:</strong> EverSenior
                    </p>
                    <p>
                      <strong>Availability:</strong> Confirm with the admin team
                    </p>
                    <p>
                      <strong>Distribution:</strong> Subject to onboarding approval
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-[#F1E4D6] p-4 text-sm leading-6 text-[#6D5D53]">
                  The T-shirt shown here is a visual illustration. It does
                  not confirm that a physical uniform has been issued.
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
