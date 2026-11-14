import { hashString } from "@utils/backgrounds";

export const CATEGORY_COLORS = [
  "border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
  "border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.15)]",
  "border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]",
  "border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]",
  "border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.15)]",
  "border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.15)]",
  "border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.15)]",
  "border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
  "border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
  "border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]",
  "border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
  "border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]",
  "border-lime-500/40 shadow-[0_0_15px_rgba(132,204,22,0.15)]",
  "border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.15)]",
  "border-fuchsia-500/40 shadow-[0_0_15px_rgba(217,70,239,0.15)]",
];

export const getCategoryStyles = (category: string) =>
  CATEGORY_COLORS[hashString(category) % CATEGORY_COLORS.length];

// Scale the header font down for longer category names so they fit the 60px
// card unit without truncating with an ellipsis.
export const getCategoryTitleSizeClass = (length: number): string => {
  if (length <= 14) return "text-lg";
  if (length <= 20) return "text-base";
  if (length <= 26) return "text-sm";
  return "text-xs";
};
