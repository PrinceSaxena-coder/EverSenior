
import { Link } from "react-router-dom";
import CompanionNavbar from "./CompanionNavbar";

const services = [
  {
    name: "Doctor Consultation",
    description: "Assistance with doctor appointments and consultations.",
    icon: "🩺",
  },
  {
    name: "Nursing Care",
    description: "Explore nursing assistance for seniors at home.",
    icon: "🩹",
  },
  {
    name: "Physiotherapy",
    description: "Support for mobility, movement, and recovery.",
    icon: "🦿",
  },
  {
    name: "Diagnostic Tests",
    description: "Assistance with medical tests and reports.",
    icon: "🧪",
  },
  {
    name: "Medicine Support",
    description: "Help organising prescriptions and medicine refills.",
    icon: "💊",
  },
  {
    name: "Hospital Assistance",
    description: "Help coordinating hospital visits and appointments.",
    icon: "🏥",
  },
];

export default function MedicalServices() {
  return (
    <>
      <CompanionNavbar />

      <div className="min-h-screen bg-[#FAF6F0] px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-[#4E342E]">
            Medical Services
          </h1>

          <p className="mt-3 text-[#795548]">
            Explore healthcare support services for seniors.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.name}
                className="rounded-2xl border border-[#E9DED2] bg-white p-6 shadow-sm"
              >
                <div className="text-4xl">{service.icon}</div>

                <h2 className="mt-4 text-xl font-bold text-[#4E342E]">
                  {service.name}
                </h2>

                <p className="mt-3 text-sm leading-6 text-[#6D5D53]">
                  {service.description}
                </p>

                <Link
                  to="/companion/help"
                  className="mt-5 inline-block rounded-lg bg-[#795548] px-5 py-2 text-sm font-semibold text-white hover:bg-[#634439]"
                >
                  Get Help
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-8 rounded-xl bg-[#F3E8DC] p-4 text-sm text-[#6D5D53]">
            This page provides general service information only. It does not
            provide medical diagnosis or treatment. Confirm provider
            qualifications and availability before arranging care.
          </p>
        </div>
      </div>
    </>
  );
}
