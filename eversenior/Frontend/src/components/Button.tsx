import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function Button({
  href,
  children,
  variant = "dark",
}: {
  href: string;
  children: ReactNode;
  variant?: "dark" | "light";
}) {
  const tone =
    variant === "dark"
      ? "bg-ink text-cream hover:bg-moss"
      : "bg-cream text-ink hover:bg-sand";

  const className = `inline-flex min-h-12 items-center rounded-full px-7 text-[15px] font-medium transition-colors duration-300 ${tone}`;

  // Internal routes (like /signup) use the router; emails and anchors stay normal links.
  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}