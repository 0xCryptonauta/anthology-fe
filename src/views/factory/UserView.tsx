import { AddressContracts } from "../../components/AddressContracts";

export const UserView = () => {
  return (
    <div
      className="bg-dark"
      style={{
        //width: "100svh",
        height: "100svh",
        color: "white",
        //border: "1px solid white",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      <AddressContracts />
    </div>
  );
};
