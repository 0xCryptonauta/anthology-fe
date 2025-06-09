import { Card } from "react-bootstrap";

import { useAppSelector } from "@store/utils/hooks";

//import { useParams } from "react-router-dom";
import "./style.css";
import { Address } from "@src/types/common";

interface AnthologyStateProps {
  contractAddr: Address;
}

export const AnthologyState: React.FC<AnthologyStateProps> = ({
  contractAddr,
}) => {
  //const { userContracts } = useAppSelector((state) => state.factory);

  //const { ethAddr, id } = useParams();

  /* const anthology = useAppSelector((state) =>
    contractAddr ? state.anthology[contractAddr] : undefined
  ); */

  /*   let contractAddr = "";

  if (JSON.stringify(userContracts) != "{}") {
    try {
      contractAddr = userContracts[ethAddr as string][Number(id)];
    } catch (error) {
      console.error("Error getting userContracts:", error);
    }
  } */

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
      <Card className="cardStyle">
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>Contract Addr</Card.Title>
          <Card.Text style={{ fontSize: "12px" }}>{contractAddr}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="cardStyle">
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>Owner</Card.Title>
          <Card.Text style={{ fontSize: "12px" }}>
            {anthologyState?.owner.toString()}
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="cardStyle">
        <Card.Body className="cardBodyStyle">
          <Card.Title>Title</Card.Title>
          <Card.Text>{anthologyState?.title}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="cardStyle">
        <Card.Body className="cardBodyStyle">
          <Card.Title style={{ fontSize: "18px" }}>
            Anthology length{" "}
          </Card.Title>
          <Card.Text>{anthologyState?.currentMemoirCount.toString()}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="cardStyle">
        <Card.Body className="cardBodyStyle">
          <Card.Title>useERC20 </Card.Title>
          <Card.Text>{anthologyState?.useERC20.toString()}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="cardStyle">
        <Card.Body>
          <Card.Title style={{ textAlign: "center" }}>
            ERC20 Address{" "}
          </Card.Title>
          <Card.Text style={{ fontSize: "12px" }}>
            {anthologyState?.erc20Token.toString()}
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="cardStyle">
        <Card.Body className="cardBodyStyle">
          <Card.Title>maxMemoirs </Card.Title>
          <Card.Text>{anthologyState?.maxMemoirs.toString()}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="cardStyle">
        <Card.Body className="cardBodyStyle">
          <Card.Title>memoirPrice </Card.Title>
          <Card.Text>{anthologyState?.memoirPrice.toString()}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="cardStyle">
        <Card.Body className="cardBodyStyle">
          <Card.Title style={{ fontSize: "18px" }}>Created Memoirs </Card.Title>
          <Card.Text>
            {anthologyState?.totalCreatedMemoirs.toString()}
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="cardStyle">
        <Card.Body className="cardBodyStyle">
          <Card.Title>useBuffer </Card.Title>
          <Card.Text>{anthologyState?.useBuffer.toString()}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="cardStyle">
        <Card.Body className="cardBodyStyle">
          <Card.Title style={{ fontSize: "18px" }}>
            whitelistedEnabled
          </Card.Title>
          <Card.Text>{anthologyState?.whitelistEnabled.toString()}</Card.Text>
        </Card.Body>
      </Card>

      <Card className="cardStyle">
        <Card.Body className="cardBodyStyle">
          <Card.Title style={{ fontSize: "18px" }}>Skin</Card.Title>
          <Card.Text>{anthologyState?.skin}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};
