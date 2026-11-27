import { Address } from "@src/types/common";

export interface FactoryContractsData {
  userContracts: { [key: Address]: Address[] };
  titles: { [key: Address]: string };
}

export const transformFactoryContracts = (
  data: unknown,
  users: Address[]
): FactoryContractsData => {
  if (
    !Array.isArray(data) ||
    data.length < 2 ||
    !Array.isArray(data[0]) ||
    !Array.isArray(data[1]) ||
    data[0].length !== data[1].length ||
    users.length < data[0].length ||
    !data[0].every(Array.isArray) ||
    !data[1].every(Array.isArray)
  ) {
    throw new Error("Invalid factory contracts response");
  }

  return transformData(data as Address[][][], users);
};

export function transformData(data: Address[][][], users: Address[]) {
  const [userContractsArray, titlesArray] = data;

  const userContracts: { [key: Address]: Address[] } = {};
  const titles: { [key: Address]: string } = {};

  userContractsArray.forEach((contracts, index) => {
    const userAddress = users[index]; // Assuming the first contract in each subarray belongs to the user

    userContracts[userAddress] = contracts;

    contracts.forEach((contractAddress, contractIndex) => {
      const title = titlesArray[index][contractIndex];
      titles[contractAddress] = title;
    });
  });

  return {
    userContracts,
    titles,
  };
}
