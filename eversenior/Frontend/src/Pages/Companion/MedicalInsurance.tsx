
import { Link } from "react-router-dom";
import CompanionNavbar from "./CompanionNavbar";

export default function MedicalInsurance() {
  return (
    <>
      <CompanionNavbar />

      <main className="min-h-screen bg-[#FAF6F0] px-6 py-10">
        <div className="mx-auto max-w-4xl">

          <h1 className="text-3xl font-bold text-[#4E342E]">
            Medical Insurance for Seniors
          </h1>

          <p className="mt-4 leading-7 text-[#6D5D53]">
            Medical insurance helps protect individuals and families
            from high healthcare expenses. Depending on the scheme and
            eligibility, it may help cover hospitalisation, treatment,
            medicines, and other approved medical expenses.
          </p>

          <section className="mt-8 rounded-2xl border border-[#E9DED2] bg-white p-6">
            <h2 className="text-xl font-bold text-[#4E342E]">
              Benefits of Medical Insurance
            </h2>

            <ul className="mt-5 space-y-4 text-[#6D5D53]">
              <li>
                <strong>1. Financial Protection:</strong>{" "}
                Helps reduce the financial burden of eligible medical
                treatment and hospitalisation.
              </li>

              <li>
                <strong>2. Hospitalisation Coverage:</strong>{" "}
                Eligible schemes may cover approved hospital treatments
                and procedures.
              </li>

              <li>
                <strong>3. Cashless Treatment:</strong>{" "}
                Eligible beneficiaries may receive covered treatment
                at participating hospitals without paying the covered
                amount upfront, subject to scheme rules.
              </li>

              <li>
                <strong>4. Support for Senior Citizens:</strong>{" "}
                Government health schemes can help eligible older
                adults access healthcare benefits.
              </li>

              <li>
                <strong>5. Peace of Mind:</strong>{" "}
                Suitable coverage can help seniors and families plan
                for unexpected healthcare expenses.
              </li>
            </ul>
          </section>

          <section className="mt-6 rounded-2xl bg-[#F1E4D6] p-6">
            <h2 className="text-xl font-bold text-[#4E342E]">
              Government Health Insurance Scheme
            </h2>

            <p className="mt-3 leading-7 text-[#6D5D53]">
              Ayushman Bharat Pradhan Mantri Jan Arogya Yojana
              (AB PM-JAY) is a Government of India health assurance
              scheme that provides eligible beneficiaries with
              coverage for specified hospital treatments.
              Check the official portal for eligibility and details.
            </p>

            <a
              href="https://beneficiary.nha.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-xl bg-[#795548] px-6 py-3 font-semibold text-white transition hover:bg-[#634439]"
            >
              Visit Official Government Portal ↗
            </a>
          </section>

          <p className="mt-6 text-sm leading-6 text-[#8D776A]">
            Note: Benefits depend on eligibility, scheme rules, and
            approved treatments. This page provides general information
            and is not a guarantee of insurance coverage.
          </p>

        </div>
      </main>
    </>
  );
}
