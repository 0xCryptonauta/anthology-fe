import { Card } from "@components/Layout/Card";
import { useAppSelector } from "@store/utils/hooks";
//import { useParams } from "react-router-dom";
import "./style.css";
import { Address } from "@src/types/common";
import { downloadObjAsJson } from "@src/utils/downloadObjAsJson";

interface LocalAnthologyStateProps {
  contractAddr: Address;
}

export const LocalAnthologyState: React.FC<LocalAnthologyStateProps> = ({
  contractAddr,
}) => {
  const currentTitle = useAppSelector(
    (state) => state.localAnthology.contractsTitles[contractAddr]
  );
  const anthology = useAppSelector(
    (state) => state.localAnthology.anthologies[contractAddr]
  );
  const defaultSkin = useAppSelector(
    (state) => state.localAnthology.defaultSkin[contractAddr]
  );

  const downloadLocalAnthology = () => {
    const anthologyData = {
      contractAddr: contractAddr,
      title: currentTitle,
      anthology: anthology,
      defaultSkin: defaultSkin,
    };
    downloadObjAsJson(
      anthologyData,
      `${currentTitle.replace(/\s+/g, "_")}_anthology.json`
    );
  };

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
      <Card title="Title" content={currentTitle} />

      <Card title="Anthology length" content={anthology.length} />

      <Card title="maxMemoirs" content="100" />

      <Card title="Default Skin" content={defaultSkin} />

      <Card
        title="Download Anthology"
        content={
          <span
            style={{ cursor: "pointer", fontSize: "20px" }}
            onClick={downloadLocalAnthology}
          >
            💾
          </span>
        }
      />
    </div>
  );
};
