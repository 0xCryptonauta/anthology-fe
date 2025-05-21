import { Address } from "@src/types/common";

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
