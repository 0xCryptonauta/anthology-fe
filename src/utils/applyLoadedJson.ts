import type { AppDispatch } from "@src/store/redux";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
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
import type { MemoirInterface } from "@src/store/slices/anthologySlice";
import type { LoadedJson } from "@src/utils/validateJsonContentType";

export const addOneAnthologyToLocal = (
  dispatch: AppDispatch,
  data: LoadedJson
): Address[] => {
  const contract = data.anthology?.contractAddr as Address | undefined;
  if (!contract) return [];

  dispatch(
    addUserLocalAnthology({
      user: LOCAL_USER_ADDR,
      contract,
      title: data.anthology?.title || "Error loading title",
    })
  );

  dispatch(
    addManyMemoirsToUserLocalAnthology({
      contract,
      memoirs: (data.anthology?.anthology || []) as MemoirInterface[],
    })
  );

  dispatch(
    setDefaultSkin({
      contract,
      newDefaultSkin: data.anthology?.defaultSkin as SkinType,
    })
  );

  return [contract];
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
  data: LoadedJson
): Address[] => {
  dispatch(
    updateLocalUserContracts(
      (data.localMemory?.userContracts || {}) as UserContractsType
    )
  );

  dispatch(
    updateLocalContractTitles(
      (data.localMemory?.contractsTitles || {}) as ContractTitlesType
    )
  );

  dispatch(
    setManyDefaultSkin(
      (data.localMemory?.defaultSkin || {}) as { [key: Address]: SkinType }
    )
  );

  dispatch(
    addAnthologiesToLocalMemory({
      anthologies: (data.localMemory?.anthologies || {}) as AnthologyType,
    })
  );

  return Object.keys(data.localMemory?.anthologies ?? {}) as Address[];
};
