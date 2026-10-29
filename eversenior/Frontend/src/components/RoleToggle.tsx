export type Role = "eversenior" | "companion";

const options: { value: Role; label: string }[] = [
  { value: "eversenior", label: "EverSenior" },
  { value: "companion", label: "Companion" },
];

export function RoleToggle({
  role,
  onChange,
  label = "I am joining as",
}: {
  role: Role;
  onChange: (role: Role) => void;
  label?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="mb-8 grid grid-cols-2 rounded-xl bg-[#F1EEE5] p-1"
    >
      {options.map((option) => {
        const active = role === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`rounded-lg py-2.5 text-sm font-medium transition ${
              active
                ? "bg-white text-[#24352B] shadow-sm"
                : "text-[#77776F] hover:text-[#24352B]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}