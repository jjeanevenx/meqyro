import type { InputHTMLAttributes } from "react";

type RadioCardProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  description?: string;
};

export function RadioCard({ id, label, description, className = "", ...props }: RadioCardProps) {
  return (
    <label className={`radio-card ${className}`.trim()} htmlFor={id}>
      <input {...props} id={id} type="radio" />
      <span className="radio-card__copy">
        <strong>{label}</strong>
        {description ? <small>{description}</small> : null}
      </span>
      <span aria-hidden="true" className="choice__control" />
    </label>
  );
}
