import { Card } from "../Layout/Card";

import { useAppSelector } from "@store/utils/hooks";

//import { useParams } from "react-router-dom";
import "./style.css";
import { Address } from "@src/types/common";
import { CHAIN_SCAN_URL } from "@src/utils/constants";
import { QRCodeGenerator } from "../Layout/QRCodeGenerator";

interface AnthologyStateProps {
  contractAddr: Address;
}

export const AnthologyState: React.FC<AnthologyStateProps> = ({
  contractAddr,
}) => {
  const anthologyState = useAppSelector((state) => {
    try {
      if (state.anthology[contractAddr])
        return state.anthology[contractAddr].anthologyState;
    } catch (error) {
      console.error("error in anthologyState", error);
      return null;
    }
  });

  return (
    <div
      style={{
        //border: "1px solid white",
        padding: "5px",
        borderRadius: "7px",
        margin: "3px",
        width: "380px",
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <Card
        title="Anthology Addr"
        content={contractAddr}
        contentHref={CHAIN_SCAN_URL + contractAddr}
      />

      <Card
        title="Anthology QR Addr"
        content={
          <QRCodeGenerator
            text={JSON.stringify({ type: "anthology", address: contractAddr })}
          />
        }
      />

      <Card title="Owner" content={anthologyState?.owner.toString()} />

      <Card title="Title" content={anthologyState?.title} />

      <Card
        title="Anthology length"
        content={anthologyState?.currentMemoirCount.toString()}
      />

      <Card title="useERC20" content={anthologyState?.useERC20.toString()} />

      <Card
        title="ERC20 Address"
        content={anthologyState?.erc20Token.toString()}
      />

      <Card
        title="maxMemoirs"
        content={anthologyState?.maxMemoirs.toString()}
      />

      <Card
        title="memoirPrice"
        content={anthologyState?.memoirPrice.toString()}
      />

      <Card
        title="Created Memoirs"
        content={anthologyState?.totalCreatedMemoirs.toString()}
      />

      <Card title="useBuffer" content={anthologyState?.useBuffer.toString()} />

      <Card
        title="whitelistedEnabled"
        content={anthologyState?.whitelistEnabled.toString()}
      />

      <Card title="Skin" content={anthologyState?.skin} />
    </div>
  );
};
