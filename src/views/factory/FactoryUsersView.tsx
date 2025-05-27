import { FactoryUsersContracts } from "@src/components/Factory/FactoryUsersContracts";
import { useAppSelector } from "@src/store/utils/hooks";

//import { GetUserContracts } from "./GetUserContracts";

export const FactoryUsersView = () => {
  const { users } = useAppSelector((state) => state.factory);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        //border: "1px solid white",
        width: "fit-content",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      {/* <GetUserContracts /> */}
      {users ? <FactoryUsersContracts /> : <div> Loading users </div>}
    </div>
  );
};
