import { DiscoverContractsDirectory } from "@src/components/Factory/DiscoverContractsDirectory";

import { AddToDiscover } from "@src/components/Layout/AddToDiscover";

export const DiscoverView = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <AddToDiscover />

      <DiscoverContractsDirectory />
    </div>
  );
};
