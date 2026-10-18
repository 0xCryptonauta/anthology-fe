import React from "react";
import { useTranslation } from "@src/i18n/useTranslation";
import { TranslationKey } from "@src/i18n/translations";

export type OrderType = "Newer" | "Older" | "Random" | "A -> Z" | "Z -> A";

interface SelectorProps {
  value: OrderType;
  onChange: (value: OrderType) => void;
}

const orderOptions: { value: OrderType; labelKey: TranslationKey }[] = [
  { value: "Newer", labelKey: "order.newer" },
  { value: "Older", labelKey: "order.older" },
  { value: "Random", labelKey: "order.random" },
  { value: "A -> Z", labelKey: "order.az" },
  { value: "Z -> A", labelKey: "order.za" },
];

export const OrderSelector = ({ value, onChange }: SelectorProps) => {
  const { t } = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as OrderType;
    onChange(selectedValue);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      aria-label={t("a11y.orderSelector")}
      style={{
        height: "36px",
        backgroundColor: "#f9f9f9",
        color: "#111",
        padding: "0 8px",
        borderRadius: "8px",
        border: "1px solid #e2e2e2",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
        outline: "none",
        transition: "all 0.2s ease",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      {orderOptions.map((option) => (
        <option
          key={option.value}
          value={option.value}
          style={{ backgroundColor: "#fff" }}
        >
          {t(option.labelKey)}
        </option>
      ))}
    </select>
  );
};
