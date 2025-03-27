import React from "react";

export type OrderType = "Newer" | "Older" | "A -> Z" | "Z -> A";

// Define the component props interface
interface SelectorProps {
  value: OrderType;
  onChange: (value: OrderType) => void;
}

const skinOptions = ["Newer", "Older", "A -> Z", "Z -> A"];

// Define the component
export const OrderSelector = ({ value, onChange }: SelectorProps) => {
  // Handle the change event
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as unknown as OrderType;
    onChange(selectedValue);
  };

  return (
    <select
      value={value}
      onChange={(event) => {
        handleChange(event);
        console.log("Changing from selector to:", event.target.value);
      }}
      style={{
        border: "1px solid white",
        padding: "3px",
        borderRadius: "7px",
        cursor: "pointer",
        marginRight: "10px",
        backgroundColor: "unset",
        height: "32px",
      }}
    >
      {skinOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
