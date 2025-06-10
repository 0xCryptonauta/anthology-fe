import React from "react";

export type OrderType = "Newer" | "Older" | "Random" | "A -> Z" | "Z -> A";

interface SelectorProps {
  value: OrderType;
  onChange: (value: OrderType) => void;
}

const skinOptions: OrderType[] = [
  "Newer",
  "Older",
  "Random",
  "A -> Z",
  "Z -> A",
];

export const OrderSelector = ({ value, onChange }: SelectorProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as OrderType;
    onChange(selectedValue);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      style={{
        //appearance: "none",
        backgroundColor: "#f9f9f9",
        color: "#111",
        padding: "6px",
        borderRadius: "8px",
        border: "1px solid #e2e2e2",
        fontSize: "16px",
        fontWeight: 500,
        cursor: "pointer",
        outline: "none",
        transition: "all 0.2s ease",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        //WebkitAppearance: "none",
        //MozAppearance: "none",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "#6366f1")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#e2e2e2")}
    >
      {skinOptions.map((option) => (
        <option key={option} value={option} style={{ backgroundColor: "#fff" }}>
          {option}
        </option>
      ))}
    </select>
  );
};
