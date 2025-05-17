export function shortenAddress(
  address: string,
  initlen: number = 6,
  endlen: number = 4
): string {
  if (address.length <= 12) {
    return address;
  }
  return `${address?.substring(0, initlen)}...${address?.substring(
    address?.length - endlen
  )}`;
}
