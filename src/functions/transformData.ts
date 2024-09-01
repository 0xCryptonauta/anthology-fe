export function transformData(data: string[][][], users: string[]) {
  const [userContractsArray, titlesArray] = data;

  const userContracts: { [key: string]: string[] } = {};
  const titles: { [key: string]: string } = {};

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
