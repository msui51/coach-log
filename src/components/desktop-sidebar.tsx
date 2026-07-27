"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClientsIcon,
  OverviewIcon,
  ProgressIcon,
  SessionsIcon,
} from "@/components/mobile-navigation";

const links = [
  { label: "Overview", href: "/", Icon: OverviewIcon },
  { label: "Clients", href: "/clients", Icon: ClientsIcon },
  { label: "Sessions", href: "/sessions", Icon: SessionsIcon },
  { label: "Progress", href: "/progress", Icon: ProgressIcon },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="desktop-sidebar">
      <Link className="brand" href="/" aria-label="CoachLog home">
        <span className="mark" aria-hidden="true">
          C
        </span>
        <span>CoachLog</span>
      </Link>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {links.map(({ label, href, Icon }) => {
          const active = isActive(href);

          return (
            <Link
              className={`sidebar-link${active ? " selected" : ""}`}
              href={href}
              aria-current={active ? "page" : undefined}
              key={href}
            >
              <Icon className="sidebar-icon" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-privacy">
        <span className="privacy-dot" aria-hidden="true" />
        <div>
          <strong>Private by design</strong>
          <small>Data stays in this browser</small>
        </div>
      </div>

      <div className="sidebar-profile">
        <span className="avatar" aria-hidden="true">
          MS
        </span>
        <div>
          <strong>Maria Sui</strong>
          <small>Independent coach</small>
        </div>
      </div>
    </aside>
  );
}
