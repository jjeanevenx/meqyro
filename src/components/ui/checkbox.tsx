import type { InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export function Checkbox({ id, label, className = "", ...props }: CheckboxProps) {
  return (
    <label className={`choice choice--checkbox ${className}`.trim()} htmlFor={id}>
      <input {...props} id={id} type="checkbox" />
      <span aria-hidden="true" className="choice__control" />
      <span>{label}</span>
    </label>
  );
}
