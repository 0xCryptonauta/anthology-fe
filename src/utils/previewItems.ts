import type { Address } from "@src/types/common";
import type { LoadedJson } from "@src/utils/validateJsonContentType";

export interface PreviewAnthology {
  address: Address;
  title: string;
  memoirCount: number;
}

/**
 * Flatten either share payload into the anthology rows the scan preview shows.
 * A single share has one row; a memory has one row per anthology.
 */
export const buildPreviewItems = (
  kind: "single" | "group",
  data: LoadedJson
): PreviewAnthology[] => {
  if (kind === "single" && data.anthology) {
    return [
      {
        address: data.anthology.contractAddr,
        title: data.anthology.title,
        memoirCount: data.anthology.anthology.length,
      },
    ];
  }

  const local = data.localMemory;
  if (!local) return [];

  return Object.entries(local.anthologies).map(([address, memoirs]) => ({
    address: address as Address,
    title: local.contractsTitles[address as Address] || address,
    memoirCount: memoirs.length,
  }));
};
