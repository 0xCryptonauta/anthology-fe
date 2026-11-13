import type { SharedBy } from "@src/types/connect";
import { isLocalId } from "@src/utils/localId";
import {
  validateJsonContentType,
  type LoadedJson,
} from "@src/utils/validateJsonContentType";

export const MAX_NAMETAG_LENGTH = 32;

export type NametagError = "empty" | "too-long" | null;

export interface ShareEnvelope extends LoadedJson {
  sharedBy: SharedBy;
  sharedAt: number;
}

export type DecodeShareResult =
  | { ok: true; data: LoadedJson; sharedBy: SharedBy }
  | { ok: false; reason: "invalid-json" | "invalid-payload" | "missing-sender" };

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

  if (!parsed || typeof parsed !== "object") {
    return { ok: false, reason: "invalid-payload" };
  }

  const data = parsed as LoadedJson;
  const { hasLocal, isOneAnthology } = validateJsonContentType(data);

  if (!hasLocal && !isOneAnthology) {
    return { ok: false, reason: "invalid-payload" };
  }

  const sharedBy = validateSharedBy(data.sharedBy);
  if (!sharedBy) {
    return { ok: false, reason: "missing-sender" };
  }

  return { ok: true, data, sharedBy };
};
