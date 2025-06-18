import { Card } from "react-bootstrap";
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
      <Card className="cardStyle">
        <Card.Body className="cardBodyStyle">
          <Card.Title>Title</Card.Title>
          <Card.Text>{currentTitle}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="cardStyle">
        <Card.Body className="cardBodyStyle">
          <Card.Title style={{ fontSize: "18px" }}>
            Anthology length{" "}
          </Card.Title>
          <Card.Text>{anthology.length}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="cardStyle">
        <Card.Body className="cardBodyStyle">
          <Card.Title>maxMemoirs </Card.Title>
          <Card.Text>{100}</Card.Text>
        </Card.Body>
      </Card>
      <Card className="cardStyle">
        <Card.Body className="cardBodyStyle">
          <Card.Title>Default Skin </Card.Title>
          <Card.Text>{defaultSkin}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="cardStyle">
        <Card.Body className="cardBodyStyle">
          <Card.Title style={{ fontSize: "13px", fontWeight: "bold" }}>
            Download Anthology{" "}
          </Card.Title>
          <Card.Text
            style={{ cursor: "pointer" }}
            onClick={downloadLocalAnthology}
          >
            💾
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};
