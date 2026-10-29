
import { Link } from "react-router-dom";

const Terms = () => {
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
            Terms of Service
          </h1>

          <p className="mb-8 text-sm text-[#7D6E65]">
            Last updated: October 27, 2026
          </p>

          <div className="space-y-7 leading-7 text-[#5D514A]">
            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                1. About EverSenior
              </h2>
              <p>
                EverSenior is a platform designed to connect senior citizens
                and their families with companions for companionship and
                related assistance. The services available depend on the
                features offered on the platform.
              </p>
              <p className="mt-2">
                EverSenior facilitates connections and bookings. Unless
                explicitly stated otherwise, it does not guarantee the conduct,
                suitability, availability, or performance of any individual
                companion.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                2. Eligibility and Accounts
              </h2>
              <p>
                You must provide accurate information when creating an account
                and keep your account details up to date. You are responsible
                for protecting your login credentials and for activities
                carried out through your account.
              </p>
              <p className="mt-2">
                You must not impersonate another person, create fraudulent
                accounts, or use EverSenior for unlawful purposes. Notify us
                if you suspect unauthorized access to your account.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                3. Companion Registration and Verification
              </h2>
              <p>
                Companions must provide truthful registration information and
                complete the applicable onboarding process. This may include a
                psychometric questionnaire, personal interview, background
                verification, and police verification, where applicable.
              </p>
              <p className="mt-2">
                A submitted application or document does not itself mean that
                verification has been completed. Companion approval is subject
                to the actual checks and review procedures conducted by
                EverSenior.
              </p>
              <p className="mt-2">
                Do not misrepresent your qualifications, identity, experience,
                or verification status.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                4. Bookings and Services
              </h2>
              <p>
                Users must provide accurate booking details and follow the
                applicable booking, confirmation, cancellation, and payment
                processes displayed on the platform.
              </p>
              <p className="mt-2">
                A booking is subject to its displayed status and confirmation
                requirements. Users must not assume a booking is confirmed
                until the platform indicates that it is confirmed.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                5. Payments, Fees, and Cancellations
              </h2>
              <p>
                Any applicable fees, payment terms, cancellation conditions,
                and refund rules will be communicated through the platform
                where those features are available.
              </p>
              <p className="mt-2">
                Do not rely on a payment being successful unless the platform
                or authorized payment provider confirms it. Refund eligibility
                depends on the applicable policy and circumstances.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                6. Safety and Appropriate Conduct
              </h2>
              <p>
                Users must treat one another respectfully and must not engage
                in harassment, abuse, exploitation, discrimination, fraud, or
                other unlawful conduct.
              </p>
              <p className="mt-2">
                EverSenior is not an emergency response service, medical
                provider, or substitute for professional healthcare unless a
                specific service is expressly offered and appropriately
                qualified. In an emergency, contact the relevant local
                emergency services.
              </p>
              <p className="mt-2">
                Report safety concerns or suspected misconduct through the
                contact channel officially provided by EverSenior.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                7. Account Suspension and Termination
              </h2>
              <p>
                EverSenior may restrict, suspend, or terminate accounts where
                reasonably necessary to address suspected fraud, safety risks,
                violations of these terms, or legal obligations. Where
                appropriate, users may be given an explanation or an
                opportunity to respond.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                8. Account Deletion
              </h2>
              <p>
                Users may request account deletion through the account
                settings or deletion functionality provided by the platform.
                Some information may need to be retained where required by law
                or reasonably necessary to address disputes, security
                incidents, or other legitimate obligations. Further details
                are explained in our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                9. Platform Availability
              </h2>
              <p>
                We aim to keep EverSenior available and functioning reliably,
                but we cannot guarantee uninterrupted access or that every
                feature will always be available. Features may be updated,
                maintained, or discontinued as the platform develops.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                10. Changes to These Terms
              </h2>
              <p>
                These terms may be updated as EverSenior develops or as legal
                requirements change. The revised version will be published on
                this page with an updated revision date. Where required, users
                will be notified or asked to accept the updated terms.
              </p>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold text-[#4E342E]">
                11. Contact Us
              </h2>
              <p>
                For questions, complaints, or concerns about these terms,
                contact EverSenior through its officially designated support
                channel.
              </p>
              <p className="mt-2 text-sm">
                Before launch, add your verified support email or official
                contact details here.
              </p>
            </section>

            <div className="border-t border-[#E9DED2] pt-5 text-sm">
              Also read our{" "}
              <Link
                to="/privacy"
                className="font-semibold text-[#795548] underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Terms;
