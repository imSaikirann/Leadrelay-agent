import { useRef, useState } from "react";
import { Input } from "../ui/input";

interface CustomInputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  spellCheck?: boolean;
  autoCorrect?: "on" | "off";
  autoCapitalize?: string;
  autoComplete?: string;
}

export function CustomInput({
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  className = "",
  spellCheck = false,
  autoCorrect = "off",
  autoCapitalize = "none",
  autoComplete = "off",
}: CustomInputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = focused || value.length > 0;
  const showFloatingLabel = focused && value.length === 0;

  return (
    <div
      className={`relative w-full cursor-text ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Border */}
      <div
        className={`absolute -inset-[1.5px] rounded-xl transition-all duration-300 ${
          focused
            ? "bg-gradient-to-r from-[#D4622A] via-[#F5C27A] to-[#D4622A] opacity-100"
            : "bg-[#E8E2D9] opacity-60"
        }`}
      />

      <div className="relative h-[52px] rounded-xl bg-[#FAF9F6] overflow-hidden">
        {/* Label */}
        <label
          className={`absolute left-4 font-mono text-[13px] transition-all duration-200 pointer-events-none ${
            showFloatingLabel
              ? "top-[6px] scale-75 text-[#D4622A]"
              : isActive
              ? "top-[6px] scale-75 text-transparent"
              : "top-1/2 -translate-y-1/2 text-[#C4B9A8]"
          }`}
        >
          {placeholder}
        </label>

        {/* Input */}
        <Input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          spellCheck={spellCheck}
          autoCorrect={autoCorrect}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
          data-lt-active="false"
          placeholder=""
          className="absolute inset-0 border-0 bg-transparent px-4 pt-6 pb-2 text-sm font-mono text-[#1A1714] shadow-none focus-visible:ring-0"
        />

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E8E2D9]">
          <div
            className={`h-full bg-gradient-to-r from-[#D4622A] to-[#F5C27A] transition-all duration-300 ${
              focused ? "w-full" : "w-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
