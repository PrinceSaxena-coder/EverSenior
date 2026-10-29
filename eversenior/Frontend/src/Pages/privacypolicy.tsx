
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#FAF6F0] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center text-sm font-medium text-[#795548] hover:underline"
        >
          ← Back to EverSenior
        </Link>

        <article className="rounded-2xl bg-white p-6 shadow-sm sm:p-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#A07856]">
            EverSenior
          </p>

          <h1 className="mb-3 text-3xl font-bold text-[#4E342E] sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mb-8 text-sm text-[#7D6E65]">
            Last updated: October 27, 2026
          </p>

          <div className="space-y-7 leading-7 text-[#5D514A]">
            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                1. Introduction
              </h2>
              <p>
                EverSenior respects your privacy. This policy explains how
                personal information may be collected, used, stored, and shared
                when you register for or use the EverSenior platform.
              </p>
              <p className="mt-2">
                We aim to collect only information that is reasonably needed
                to operate the platform, support companionship services,
                manage bookings, maintain safety, and meet applicable legal
                obligations.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                2. Information We Collect
              </h2>
              <p>Depending on the features you use, information may include:</p>
              <ul className="mt-2 list-disc space-y-2 pl-6">
                <li>
                  Account details, such as your name, email address, phone
                  number, and login-related information.
                </li>
                <li>
                  Profile details, preferences, availability, and information
                  you choose to provide about yourself.
                </li>
                <li>
                  Booking details, service requests, booking history, and
                  relevant communications.
                </li>
                <li>
                  Companion onboarding responses, interview records, and
                  verification information where applicable.
                </li>
                <li>
                  Payment status and transaction references supplied by the
                  payment provider or required for booking administration.
                </li>
                <li>
                  Technical information needed for security, troubleshooting,
                  and operation of the platform.
                </li>
              </ul>
              <p className="mt-2">
                We should not collect sensitive information unless it is
                necessary, appropriately disclosed, and handled with suitable
                safeguards.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                3. How We Use Information
              </h2>
              <p>Information may be used to:</p>
              <ul className="mt-2 list-disc space-y-2 pl-6">
                <li>Create and manage user accounts.</li>
                <li>Display permitted companion profile information.</li>
                <li>Coordinate onboarding, screening, and verification.</li>
                <li>Process bookings and related payment records.</li>
                <li>Respond to support requests and safety concerns.</li>
                <li>Protect accounts, investigate suspected misuse, and maintain platform security.</li>
                <li>Meet applicable legal and record-keeping obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                4. Profile Visibility and Information Sharing
              </h2>
              <p>
                Information shown on a profile depends on the user's role,
                the platform's features, and the applicable access controls.
                Only information intended for public or authorized viewing
                should be displayed in companion discovery.
              </p>
              <p className="mt-2">
                Verification documents, private contact details, screening
                responses, and reviewer notes must not be exposed as public
                profile information.
              </p>
              <p className="mt-2">
                We may share necessary information with the relevant senior,
                companion, or authorized family member to facilitate a booking
                or service, subject to permissions and the features actually
                enabled on the platform.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                5. Verification Information
              </h2>
              <p>
                If companion onboarding requires screening, we may process
                relevant questionnaire responses, interview records, and
                background or police verification information for the stated
                verification purpose.
              </p>
              <p className="mt-2">
                Access to such information should be restricted to authorized
                personnel. Information must not be treated as verified unless
                the relevant check has actually been completed.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                6. Payments and Service Providers
              </h2>
              <p>
                If payment services are enabled, a third-party payment provider
                may process payment information under its own applicable terms
                and privacy policy. EverSenior may receive transaction
                references, payment status, and other information needed to
                manage bookings.
              </p>
              <p className="mt-2">
                Do not store complete payment-card details or payment
                credentials in EverSenior's database unless a properly
                authorized and compliant payment arrangement specifically
                supports it.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                7. Data Storage and Security
              </h2>
              <p>
                EverSenior should use appropriate technical and organizational
                safeguards to protect personal information against unauthorized
                access, loss, misuse, or disclosure. These measures may include
                access controls, secure authentication, restricted document
                storage, and appropriate monitoring.
              </p>
              <p className="mt-2">
                No internet-based system can guarantee absolute security.
                Users should keep their login credentials private and notify
                us if they suspect unauthorized account access.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                8. Data Retention and Deletion
              </h2>
              <p>
                We retain personal information only for as long as reasonably
                necessary for the purposes described in this policy, subject
                to applicable legal requirements and legitimate record-keeping
                needs.
              </p>
              <p className="mt-2">
                Users may request account deletion through the available
                account settings or support process. Depending on legal
                obligations, safety needs, disputes, or transaction records,
                certain information may need to be retained or anonymized
                rather than immediately erased.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                9. Your Privacy Rights
              </h2>
              <p>
                Subject to applicable law, you may be able to request access
                to, correction of, or deletion of your personal information,
                or raise a concern about how it is processed.
              </p>
              <p className="mt-2">
                Contact EverSenior through its officially designated support
                channel to make a privacy-related request.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                10. Children's Privacy
              </h2>
              <p>
                EverSenior is intended for eligible adult users. Do not create
                an account for a child or submit a child's personal information
                unless the platform expressly supports the relevant use and
                all applicable legal requirements are met.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                11. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy as the platform, its data
                practices, or legal requirements change. The latest version
                and revision date will be published on this page.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                12. Contact Us
              </h2>
              <p>
                For privacy questions, data requests, or complaints, contact
                EverSenior through its officially designated support channel.
              </p>
              <p className="mt-2 text-sm">
                Before launch, add your verified support email and any legally
                required privacy contact details here.
              </p>
            </section>

            <div className="border-t border-[#E9DED2] pt-5 text-sm">
              Also read our{" "}
              <Link
                to="/terms"
                className="font-semibold text-[#795548] underline underline-offset-4"
              >
                Terms of Service
              </Link>
              .
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
