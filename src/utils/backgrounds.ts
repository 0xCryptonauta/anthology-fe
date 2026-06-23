export const hashString = (s: string): number => {
  let hash = 0;
  const lower = s.toLowerCase();
  for (let i = 0; i < lower.length; i++) {
    hash = ((hash << 5) - hash) + lower.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const BG_CLASSES = [
  "bg-triangles-squares",
  "bg-circles-stripes",
  "bg-circle-pills",
  "bg-squares-2",
  "bg-rectangles-3d",
  "bg-arc",
  "bg-checkerboard-optical-illusion",
  "bg-lines-dots",
  "bg-triangles-mosaic",
  "bg-diagonal-wavy-squares",
];

export const getBgClass = (key: string) =>
  `bg-overlay ${BG_CLASSES[hashString(key) % BG_CLASSES.length]}`;
