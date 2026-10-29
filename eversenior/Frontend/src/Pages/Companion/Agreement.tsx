import { useState } from "react";
import { Link } from "react-router-dom";
import CompanionNavbar from "./CompanionNavbar";

export default function Agreement() {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (!accepted) return;

    // TODO: Save acceptance to your backend with the logged-in
    // companion's ID, agreement version, and acceptance timestamp.
    alert("Agreement accepted. Please connect this action to your backend.");
  };

  return (
    <>
      <CompanionNavbar />

      <div className="min-h-screen bg-[#FAF6F0] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm sm:p-10">
            <h1 className="text-3xl font-bold text-[#4E342E]">
              Companion Agreement
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#795548]">
              Please read the following terms carefully before accepting your
              role as an EverSenior companion.
            </p>

            <p className="mt-2 text-xs text-[#8D8178]">
              Agreement version: 1.0
            </p>

            <div className="mt-8 space-y-7 text-sm leading-7 text-[#5D5149]">
              <section>
                <h2 className="text-lg font-bold text-[#4E342E]">
                  1. Purpose of the Agreement
                </h2>
                <p>
                  This agreement describes the expectations and responsibilities
                  of companions using the EverSenior platform to provide
                  companionship and agreed support services to senior citizens.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#4E342E]">
                  2. Companion Responsibilities
                </h2>
                <ul className="list-disc space-y-1 pl-6">
                  <li>Provide respectful, patient, and reliable companionship.</li>
                  <li>Arrive at agreed times and communicate delays promptly.</li>
                  <li>Maintain professional boundaries with seniors and families.</li>
                  <li>Follow the agreed booking details and platform policies.</li>
                  <li>Never misrepresent qualifications or identity.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#4E342E]">
                  3. Safety and Verification
                </h2>
                <p>
                  Companions must provide accurate information and cooperate
                  with applicable identity, background, interview, and police
                  verification processes. Submission of information does not
                  mean verification is complete or approval has been granted.
                </p>
                <p className="mt-2">
                  Companions must promptly report safety concerns, suspected
                  abuse, emergencies, or inappropriate conduct through the
                  appropriate support or emergency channels.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#4E342E]">
                  4. Privacy and Confidentiality
                </h2>
                <p>
                  Companions must protect the personal information of seniors
                  and their families. Do not disclose private details, share
                  photographs, record conversations, or use personal information
                  without appropriate permission and a lawful purpose.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#4E342E]">
                  5. Professional Boundaries
                </h2>
                <p>
                  Companions must not exploit seniors, pressure them for money
                  or gifts, misuse their property, or engage in harassment,
                  discrimination, or any form of abuse. Medical treatment,
                  financial management, and other specialised services must
                  not be undertaken unless appropriately authorised and qualified.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#4E342E]">
                  6. Bookings and Payments
                </h2>
                <p>
                  Companions must follow the platform's applicable booking,
                  cancellation, attendance, and payment policies. Any service
                  fees, payout arrangements, or deductions must be communicated
                  separately and clearly before they apply.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#4E342E]">
                  7. Complaints and Violations
                </h2>
                <p>
                  EverSenior may review complaints and investigate reported
                  violations. Depending on the findings and applicable policies,
                  access to bookings may be restricted or an account may be
                  suspended or terminated, subject to applicable law and any
                  required process.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#4E342E]">
                  8. Ending the Relationship
                </h2>
                <p>
                  Companions may request to discontinue their participation
                  through the platform's designated process. Outstanding
                  bookings, payments, confidentiality obligations, and other
                  applicable responsibilities must be addressed appropriately.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold text-[#4E342E]">
                  9. Acknowledgement
                </h2>
                <p>
                  By accepting below, you confirm that you have read and
                  understood this agreement and agree to follow its terms,
                  subject to applicable law and the final agreement approved
                  by EverSenior.
                </p>
              </section>
            </div>

            <div className="mt-8 border-t border-[#E9DED2] pt-6">
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#4E342E]">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#795548]"
                />
                <span>
                  I have read and agree to the EverSenior Companion Agreement.
                </span>
              </label>

              <button
                type="button"
                onClick={handleAccept}
                disabled={!accepted}
                className="mt-6 w-full rounded-xl bg-[#795548] px-6 py-3 font-semibold text-white transition hover:bg-[#634439] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Accept Agreement
              </button>

              <p className="mt-4 text-xs leading-5 text-[#8D8178]">
                This is a draft template. Have the final agreement reviewed
                for your business model and applicable Indian laws before
                using it as a legally binding contract.
              </p>

              <Link
                to="/companion/dashboard"
                className="mt-5 inline-block text-sm font-semibold text-[#795548] hover:underline"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}