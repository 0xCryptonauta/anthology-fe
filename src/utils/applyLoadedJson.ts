import type { AppDispatch } from "@src/store/redux";
import { DEFAULT_SKIN, LOCAL_USER_ADDR } from "@src/utils/constants";
import {
  addAnthologiesToLocalMemory,
  addManyMemoirsToUserLocalAnthology,
  addUserLocalAnthology,
  setDefaultSkin,
  setManyDefaultSkin,
  updateLocalContractTitles,
  updateLocalUserContracts,
} from "@src/store/slices/localAnthologySlice";
import {
  updateContractTitles,
  updateUserContracts,
  updateUsers,
} from "@src/store/slices/factorySlice";
import type {
  Address,
  AnthologyType,
  ContractTitlesType,
  SkinType,
  UserContractsType,
} from "@src/types/common";
import type { ReceivedFrom } from "@src/types/connect";
import type { MemoirInterface } from "@src/store/slices/anthologySlice";
import type { LoadedJson } from "@src/utils/validateJsonContentType";

export interface ImportContext {
  /** Local user's contracts before this import. */
  existingOwn: Address[];
  /** Provenance before this import. */
  receivedFrom: Record<Address, ReceivedFrom>;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isMemoir = (value: unknown): boolean =>
  isRecord(value) &&
  typeof value.sender === "string" &&
  typeof value.title === "string" &&
  typeof value.content === "string" &&
  typeof value.timestamp === "string";

const isAddress = (value: unknown): value is Address =>
  typeof value === "string" && /^0x[0-9a-fA-F]+$/.test(value);

/**
 * Addresses whose provenance should be recorded after an import.
 *
 * Newly added anthologies get a contact. Previously received anthologies keep
 * their contact and get a newer `receivedAt`. Addresses the recipient already
 * owned are never converted to read-only.
 */
export const addressesToMark = (
  incoming: Address[],
  existingOwn: Address[],
  receivedFrom: Record<Address, ReceivedFrom>
): Address[] => {
  const own = new Set(existingOwn);
  return incoming.filter(
    (address) => !own.has(address) || Boolean(receivedFrom[address])
  );
};

export const addOneAnthologyToLocal = (
  dispatch: AppDispatch,
  data: LoadedJson,
  context: ImportContext
): Address[] => {
  const single = data.anthology;

  if (
    !isRecord(single) ||
    !isAddress(single.contractAddr) ||
    !Array.isArray(single.anthology)
  ) {
    return [];
  }

  const contract = single.contractAddr;
  const memoirs = single.anthology.filter(
    isMemoir
  ) as unknown as MemoirInterface[];
  const defaultSkin =
    typeof single.defaultSkin === "string"
      ? (single.defaultSkin as SkinType)
      : DEFAULT_SKIN;

  const toMark = addressesToMark(
    [contract],
    context.existingOwn,
    context.receivedFrom
  );

  dispatch(
    addUserLocalAnthology({
      user: LOCAL_USER_ADDR,
      contract,
      title:
        typeof single.title === "string" ? single.title : "Error loading title",
    })
  );

  dispatch(
    addManyMemoirsToUserLocalAnthology({
      contract,
      memoirs,
    })
  );

  dispatch(
    setDefaultSkin({
      contract,
      newDefaultSkin: defaultSkin,
    })
  );

  return toMark;
};

export const addDiscoveriesToMemory = (
  dispatch: AppDispatch,
  data: LoadedJson
): void => {
  dispatch(updateUsers((data.discoveries?.users || []) as Address[]));

  dispatch(
    updateUserContracts(
      (data.discoveries?.userContracts || {}) as UserContractsType
    )
  );

  dispatch(
    updateContractTitles(
      (data.discoveries?.contractsTitles || {}) as ContractTitlesType
    )
  );
};

export const addMemoryToMemory = (
  dispatch: AppDispatch,
  data: LoadedJson,
  context: ImportContext
): Address[] => {
  const local = data.localMemory;

  if (
    !isRecord(local) ||
    !Array.isArray(local.users) ||
    !isRecord(local.userContracts) ||
    !isRecord(local.contractsTitles) ||
    !isRecord(local.anthologies) ||
    !isRecord(local.defaultSkin)
  ) {
    return [];
  }

  const validAnthologies: AnthologyType = {};

  for (const [address, memoirs] of Object.entries(local.anthologies)) {
    if (!isAddress(address) || !Array.isArray(memoirs)) continue;
    validAnthologies[address] = memoirs.filter(
      isMemoir
    ) as unknown as MemoirInterface[];
  }

  const incoming = Object.keys(validAnthologies) as Address[];
  const toMark = addressesToMark(
    incoming,
    context.existingOwn,
    context.receivedFrom
  );

  dispatch(
    updateLocalUserContracts(local.userContracts as UserContractsType)
  );

  dispatch(
    updateLocalContractTitles(local.contractsTitles as ContractTitlesType)
  );

  dispatch(
    setManyDefaultSkin(local.defaultSkin as { [key: Address]: SkinType })
  );

  dispatch(
    addAnthologiesToLocalMemory({
      anthologies: validAnthologies,
    })
  );

  return toMark;
};
