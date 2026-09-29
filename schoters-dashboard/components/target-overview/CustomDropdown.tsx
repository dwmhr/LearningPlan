"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

interface CustomDropdownProps<T extends string> {
  icon: LucideIcon;
  value: T;
  options: {
    value: T;
    label: string;
  }[];
  onChange: (value: T) => void;
}

export default function CustomDropdown<T extends string>({
  icon: Icon,
  value,
  options,
  onChange,
}: CustomDropdownProps<T>) {
  const [open, setOpen] = useState(false);

  const wrapperRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const selected = options.find(
    (option) => option.value === value,
  );

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((current) => !current)
        }
        className="
          flex items-center gap-2
          whitespace-nowrap
          rounded-xl
          border border-slate-200
          bg-white
          px-3.5 py-2.5
          text-sm font-medium
          text-slate-600
          transition-colors
          hover:border-slate-300
        "
      >
        <Icon className="h-4 w-4 shrink-0 text-slate-400" />

        <span>{selected?.label}</span>

        <ChevronDown
          className={`
            h-3.5 w-3.5
            shrink-0
            text-slate-400
            transition-transform
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            left-0
            top-[calc(100%+6px)]
            z-20
            w-48
            overflow-hidden
            rounded-xl
            border border-slate-100
            bg-white
            py-1
            shadow-lg
            shadow-slate-200/60
          "
        >
          {options.map((option) => {
            const isActive =
              option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`
                  flex w-full
                  items-center
                  justify-between
                  px-3.5 py-2
                  text-left
                  text-sm
                  transition-colors

                  ${
                    isActive
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }
                `}
              >
                {option.label}

                {isActive && (
                  <span
                    className="
                      h-1.5
                      w-1.5
                      shrink-0
                      rounded-full
                      bg-blue-600
                    "
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}