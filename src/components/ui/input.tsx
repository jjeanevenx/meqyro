import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

export function Input({ id, label, error, hint, className = "", ...props }: InputProps) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <label className="field" htmlFor={id}>
      <span className="field__label">{label}</span>
      <input
        {...props}
        id={id}
        className={`field__input ${className}`.trim()}
        aria-invalid={error ? true : undefined}
        aria-describedby={descriptionId}
      />
      {error ? (
        <InlineError id={descriptionId!}>{error}</InlineError>
      ) : hint ? (
        <span className="field__hint" id={descriptionId}>
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function InlineError({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <span className="inline-error" id={id} role="alert">
      {children}
    </span>
  );
}
