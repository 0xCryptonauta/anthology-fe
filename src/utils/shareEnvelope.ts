import type { SharedBy } from "@src/types/connect";
import { isLocalId } from "@src/utils/localId";
import type { LoadedJson } from "@src/utils/validateJsonContentType";

export const MAX_NAMETAG_LENGTH = 32;

export type NametagError = "empty" | "too-long" | null;

export interface ShareEnvelope extends LoadedJson {
  sharedBy: SharedBy;
  sharedAt: number;
}

export type SharePayloadKind = "single" | "group";

export type DecodeShareResult =
  | {
      ok: true;
      kind: SharePayloadKind;
      data: LoadedJson;
      sharedBy: SharedBy;
    }
  | {
      ok: false;
      reason:
        | "invalid-json"
        | "invalid-payload"
        | "missing-sender"
        | "invalid-sender";
    };

const SKINS = new Set([
  "media",
  "json",
  "text",
  "playlist",
  "list",
  "\0default\0",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isStringArray = (value: unknown): boolean =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isMemoir = (value: unknown): boolean =>
  isRecord(value) &&
  typeof value.sender === "string" &&
  typeof value.title === "string" &&
  typeof value.content === "string" &&
  typeof value.timestamp === "string";

const isMemoirArray = (value: unknown): boolean =>
  Array.isArray(value) && value.every(isMemoir);

const isSkin = (value: unknown): boolean =>
  typeof value === "string" && SKINS.has(value);

const isAddress = (value: unknown): value is string =>
  typeof value === "string" && /^0x[0-9a-fA-F]+$/.test(value);

const isSinglePayload = (value: unknown): boolean => {
  if (!isRecord(value)) return false;
  return (
    isAddress(value.contractAddr) &&
    typeof value.title === "string" &&
    isMemoirArray(value.anthology) &&
    isSkin(value.defaultSkin)
  );
};

const isGroupPayload = (value: unknown): boolean => {
  if (!isRecord(value)) return false;
  return (
    isStringArray(value.users) &&
    isRecord(value.userContracts) &&
    Object.values(value.userContracts).every(isStringArray) &&
    isRecord(value.contractsTitles) &&
    Object.values(value.contractsTitles).every(
      (title) => typeof title === "string"
    ) &&
    isRecord(value.anthologies) &&
    Object.values(value.anthologies).every(isMemoirArray) &&
    isRecord(value.defaultSkin) &&
    Object.values(value.defaultSkin).every(isSkin)
  );
};

/** Strict shape check for payloads received from the QR stream or a share file. */
export const validateSharePayload = (
  data: LoadedJson
): SharePayloadKind | null => {
  const hasSingle = data.anthology != null;
  const hasGroup = data.localMemory != null;

  if (hasSingle === hasGroup) return null;
  if (hasSingle) return isSinglePayload(data.anthology) ? "single" : null;
  return isGroupPayload(data.localMemory) ? "group" : null;
};

export const normalizeNametag = (value: string): string => value.trim();

export const validateNametag = (value: string): NametagError => {
  const normalized = normalizeNametag(value);
  if (normalized.length === 0) return "empty";
  if (normalized.length > MAX_NAMETAG_LENGTH) return "too-long";
  return null;
};

export const buildShareEnvelope = (
  payload: LoadedJson,
  sharedBy: SharedBy,
  now: number = Date.now()
): ShareEnvelope => ({
  ...payload,
  sharedBy: {
    deviceId: sharedBy.deviceId,
    nametag: normalizeNametag(sharedBy.nametag),
  },
  sharedAt: now,
});

export const validateSharedBy = (value: unknown): SharedBy | null => {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Partial<SharedBy>;
  if (!isLocalId(candidate.deviceId)) return null;
  if (typeof candidate.nametag !== "string") return null;
  if (validateNametag(candidate.nametag) !== null) return null;

  return {
    deviceId: candidate.deviceId,
    nametag: normalizeNametag(candidate.nametag),
  };
};

export const decodeSharePayload = (bytes: Uint8Array): DecodeShareResult => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return { ok: false, reason: "invalid-json" };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, reason: "invalid-payload" };
  }

  const data = parsed as LoadedJson;
  const kind = validateSharePayload(data);

  if (!kind) {
    return { ok: false, reason: "invalid-payload" };
  }

  const hasSender = Object.prototype.hasOwnProperty.call(data, "sharedBy");
  if (!hasSender) {
    return { ok: false, reason: "missing-sender" };
  }

  const sharedBy = validateSharedBy(data.sharedBy);
  if (!sharedBy) {
    return { ok: false, reason: "invalid-sender" };
  }

  return { ok: true, kind, data, sharedBy };
};
