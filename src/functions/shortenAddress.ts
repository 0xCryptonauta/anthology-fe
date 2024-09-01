export function shortenAddress(
  address: string,
  initlen: number = 6,
  endlen: number = 4
): string {
  return `${address.substring(0, initlen)}...${address.substring(
    address.length - endlen
  )}`;
}
