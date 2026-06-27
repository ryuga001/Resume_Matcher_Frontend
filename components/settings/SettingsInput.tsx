"use client";

import { INPUT_CLASS, INPUT_STYLE } from "@/components/settings/constants";

interface SettingsInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}

function onFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#c2652a";
  e.currentTarget.style.boxShadow = "0 0 0 2px rgba(194,101,42,0.12)";
}

function onBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#d8d0c8";
  e.currentTarget.style.boxShadow = "none";
}

export function SettingsInput({ label, type, value, onChange, placeholder, required, minLength }: SettingsInputProps) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: "#605850" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className={INPUT_CLASS}
        style={INPUT_STYLE}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}
