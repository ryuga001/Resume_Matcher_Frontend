"use client";
import { Eye, EyeOff } from "lucide-react";
import { INPUT_CLASS } from "@/components/auth/constants";

interface AuthInputProps {
  label: string;
  labelSuffix?: React.ReactNode;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  autoFocus?: boolean;
  minLength?: number;
  showToggle?: boolean;
  showPw?: boolean;
  onToggleShow?: () => void;
}

export function AuthInput({
  label,
  labelSuffix,
  type,
  value,
  onChange,
  placeholder,
  required,
  autoFocus,
  minLength,
  showToggle,
  showPw,
  onToggleShow,
}: AuthInputProps) {
  const inputStyle = { borderColor: "#e4dcd6", background: "#fff", color: "#2a2826" };

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = "#c2652a";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(194,101,42,0.12)";
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    e.currentTarget.style.borderColor = "#e4dcd6";
    e.currentTarget.style.boxShadow = "none";
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "#6e6862" }}>
          {label}
        </label>
        {labelSuffix}
      </div>
      <div className="relative">
        <input
          type={showToggle ? (showPw ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoFocus={autoFocus}
          minLength={minLength}
          className={INPUT_CLASS + (showToggle ? " pr-11" : "")}
          style={inputStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggleShow}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "#9e8e84" }}
            tabIndex={-1}
          >
            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
