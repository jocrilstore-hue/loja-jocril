"use client";

import { useState } from "react";

export default function ToggleSwitch({
  on: initOn = false,
  onChange,
}: {
  on?: boolean;
  onChange?: (next: boolean) => void;
}) {
  const [on, setOn] = useState(initOn);
  const toggle = () => {
    const next = !on;
    setOn(next);
    onChange?.(next);
  };
  return (
    <div
      onClick={toggle}
      role="switch"
      aria-checked={on}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          toggle();
        }
      }}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        padding: 2,
        background: on ? "var(--color-accent-100)" : "var(--color-base-700)",
        cursor: "pointer",
        transition: "background .15s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          background: "#fff",
          transform: `translateX(${on ? 16 : 0}px)`,
          transition: "transform .15s",
        }}
      />
    </div>
  );
}
