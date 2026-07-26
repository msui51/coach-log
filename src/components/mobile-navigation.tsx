"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type IconProps = {
  className?: string;
};

function OverviewIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function ClientsIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  );
}

function SessionsIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M16 14v2.2l1.6 1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v.832" />
      <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" />
      <circle cx="16" cy="16" r="6" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
    </svg>
  );
}

function ProgressIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M13 5H19V11" />
      <path d="M19 5L5 19" />
    </svg>
  );
}

export function MobileNavigation() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <Link
        className={`nav-item${isActive("/") ? " selected" : ""}`}
        href="/"
        aria-current={isActive("/") ? "page" : undefined}
      >
        <OverviewIcon className="nav-icon" />
        <span>Overview</span>
      </Link>

      <Link
        className={`nav-item${isActive("/clients") ? " selected" : ""}`}
        href="/clients"
        aria-current={isActive("/clients") ? "page" : undefined}
      >
        <ClientsIcon className="nav-icon" />
        <span>Clients</span>
      </Link>

      <Link className="nav-fab" href="/sessions" aria-label="Add session">
        <span aria-hidden="true">+</span>
      </Link>

      <Link
        className={`nav-item${isActive("/sessions") ? " selected" : ""}`}
        href="/sessions"
        aria-current={isActive("/sessions") ? "page" : undefined}
      >
        <SessionsIcon className="nav-icon" />
        <span>Sessions</span>
      </Link>

      <Link
        className={`nav-item${isActive("/progress") ? " selected" : ""}`}
        href="/progress"
        aria-current={isActive("/progress") ? "page" : undefined}
      >
        <ProgressIcon className="nav-icon" />
        <span>Progress</span>
      </Link>
    </nav>
  );
}
