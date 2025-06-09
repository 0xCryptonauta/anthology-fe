export const toBytes8Hex = (str: string): `0x${string}` => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);

  if (bytes.length > 8) {
    throw new Error("String too long to encode as bytes8");
  }

  const padded = new Uint8Array(8);
  padded.set(bytes, 8 - bytes.length);

  const hex = Array.from(padded)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `0x${hex}`;
};
