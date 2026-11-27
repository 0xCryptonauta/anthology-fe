import { arbitrum } from "viem/chains";
import { isValidRpc } from "../src/utils/isValidRpc";

const rpc =
  process.env.VITE_FACTORY_RPC || arbitrum.rpcUrls.default.http[0];

if (await isValidRpc(rpc)) {
  console.log(`Factory RPC responded on Arbitrum One (chain ID ${arbitrum.id}).`);
} else {
  console.error(
    "Factory RPC validation failed. Check the URL, endpoint availability, and chain ID."
  );
  process.exit(1);
}
