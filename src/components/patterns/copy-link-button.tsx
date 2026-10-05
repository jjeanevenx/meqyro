"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export function CopyLinkButton({
  url,
  label,
  copiedLabel,
  errorLabel,
}: {
  url: string;
  label: string;
  copiedLabel: string;
  errorLabel: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  return (
    <div>
      <button
        type="button"
        className="result-share-link"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setStatus("copied");
          } catch {
            setStatus("error");
          }
        }}
      >
        <Copy size={14} aria-hidden="true" /> {status === "copied" ? copiedLabel : label}
      </button>
      <span role="status" className="sr-only">
        {status === "copied" ? copiedLabel : ""}
      </span>
      {status === "error" ? (
        <p role="alert">
          {errorLabel}{" "}
          <input
            aria-label={label}
            value={url}
            readOnly
            onFocus={(event) => event.target.select()}
          />
        </p>
      ) : null}
    </div>
  );
}
