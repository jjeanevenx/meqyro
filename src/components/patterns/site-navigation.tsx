"use client";

import { useId, useRef } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

export function SiteNavigation({
  locale,
  discoverLabel,
  blogLabel,
  howLabel,
  current,
  menuLabel,
  primaryLabel,
}: {
  locale: Locale;
  discoverLabel: string;
  blogLabel: string;
  howLabel?: string;
  current?: "home" | "discover";
  menuLabel: string;
  primaryLabel: string;
}) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const id = useId();
  const links = (
    <>
      <Link
        href={`/${locale}/discover`}
        aria-current={current === "discover" ? "page" : undefined}
        onClick={() => {
          if (menuRef.current) menuRef.current.open = false;
        }}
      >
        {discoverLabel}
      </Link>
      {howLabel ? (
        <Link
          href={`/${locale}#how-it-works`}
          onClick={() => {
            if (menuRef.current) menuRef.current.open = false;
          }}
        >
          {howLabel}
        </Link>
      ) : null}
      <Link
        href={`/${locale}/articles`}
        onClick={() => {
          if (menuRef.current) menuRef.current.open = false;
        }}
      >
        {blogLabel}
      </Link>
    </>
  );

  return (
    <>
      <nav className="site-nav-desktop" aria-label={primaryLabel}>
        {links}
      </nav>
      <details
        className="site-nav-mobile"
        ref={menuRef}
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuRef.current?.open) {
            menuRef.current.open = false;
            menuRef.current.querySelector("summary")?.focus();
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget) && menuRef.current) {
            menuRef.current.open = false;
          }
        }}
      >
        <summary aria-label={menuLabel} aria-controls={id}>
          <Menu aria-hidden="true" size={22} />
        </summary>
        <nav id={id} aria-label={primaryLabel}>
          {links}
        </nav>
      </details>
    </>
  );
}
