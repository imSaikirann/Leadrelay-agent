import { useRef, useState } from "react";
import { Input } from "../ui/input";

interface CrazyInputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

export function CustomInput({
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  className = "",
}: CrazyInputProps) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    onChange(e);
  };

  return (
    <div
      className={`relative w-full cursor-text ${className}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Gradient border */}
      <div
        className="absolute -inset-[1.5px] rounded-xl transition-all duration-300"
        style={{
          background: focused
            ? "linear-gradient(135deg, #D4622A, #F5C27A, #D4622A)"
            : "linear-gradient(135deg, #E8E2D9, #E8E2D9)",
          backgroundSize: "200% 200%",
          animation: focused ? "borderShift 2s ease infinite" : "none",
          opacity: focused ? 1 : 0.6,
        }}
      />

      <div className="relative rounded-xl bg-[#FAF9F6] overflow-hidden h-[52px]">
        {/* Scan line */}
        {focused && (
          <div
            className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4622A]/40 to-transparent pointer-events-none z-20"
            style={{ animation: "scanLine 1.5s ease-in-out infinite" }}
          />
        )}

        {/* Floating label */}
        <label
          className="absolute left-4 transition-all duration-200 pointer-events-none font-mono select-none z-10"
          style={{
            top: focused || hasValue ? "6px" : "50%",
            transform:
              focused || hasValue
                ? "translateY(0) scale(0.75)"
                : "translateY(-50%) scale(1)",
            transformOrigin: "left center",
            fontSize: "13px",
            color: focused ? "#D4622A" : "#C4B9A8",
            letterSpacing: focused ? "0.08em" : "0",
          }}
        >
          {placeholder}
        </label>

        {/* Input */}
        <Input
          ref={inputRef}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          placeholder=""
          className="absolute inset-0 z-10 border-0 bg-transparent px-4 pb-2 pt-6 text-sm text-[#1A1714] placeholder:text-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 font-mono h-full"
        />

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E8E2D9] z-10">
          <div
            className="h-full bg-gradient-to-r from-[#D4622A] to-[#F5C27A] transition-all duration-300 ease-out"
            style={{ width: focused ? "100%" : "0%" }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes borderShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
