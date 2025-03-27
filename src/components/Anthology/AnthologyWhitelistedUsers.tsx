import { useAppSelector } from "@store/utils/hooks";

export const AnthologyWhitelistedUsers = ({
  contractAddr,
}: {
  contractAddr: string;
}) => {
  const whitelistedUsers = useAppSelector((state) =>
    contractAddr ? state.anthology[contractAddr].whitelist : []
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid white",
        width: "fit-content",
        height: "fit-content",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      <h3>Whitelisted addresses: {whitelistedUsers.length}</h3>
      <div>
        {whitelistedUsers.map((address, index) => (
          <div key={index}>
            <span style={{ fontSize: "14px" }}>{address}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
