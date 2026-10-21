"use client";

import { useState, useRef, useEffect, useId } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

const localeOptions: { value: Locale; label: string }[] = [
  { value: "pt", label: "Português" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
];

export function LocaleMarketSelector({
  locale,
  languageLabel,
}: {
  locale: Locale;
  languageLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const pathname = usePathname();
  const router = useRouter();

  const currentOption = localeOptions.find((opt) => opt.value === locale);

  function changeLocale(next: Locale) {
    const parts = pathname.split("/");
    parts[1] = next;
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `meqyro_locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    router.push(`${parts.join("/") || `/${next}`}${window.location.search}${window.location.hash}`);
    setIsOpen(false);
  }

  // Close on escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("pointerdown", handleClickOutside);
      return () => document.removeEventListener("pointerdown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div
      className="locale-selector"
      ref={dropdownRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="locale-selector__trigger"
        aria-label={`${languageLabel}: ${currentOption?.label}`}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="locale-selector__current">{currentOption?.value.toUpperCase()}</span>
        <svg
          className={`locale-selector__chevron ${isOpen ? "locale-selector__chevron--open" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden="true"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul id={menuId} className="locale-selector__menu" aria-label={languageLabel}>
          {localeOptions.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                lang={option.value}
                aria-current={locale === option.value ? "true" : undefined}
                className={`locale-selector__option ${locale === option.value ? "locale-selector__option--active" : ""}`}
                onClick={() => changeLocale(option.value)}
              >
                <span className="locale-selector__option-label">{option.label}</span>
                {locale === option.value && (
                  <svg
                    className="locale-selector__check"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
