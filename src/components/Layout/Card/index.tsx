import { Card as BootstrapCard } from "react-bootstrap";
import "./style.css";

type CardProps = {
  title: string;
  content: string | React.ReactNode;
  contentHref?: string;
};

export const Card: React.FC<CardProps> = ({
  title,
  content,
  contentHref = "",
}) => {
  return (
    <BootstrapCard className="cardStyle">
      <BootstrapCard.Body className="cardBodyStyle">
        <BootstrapCard.Title
          style={{
            fontSize: title.length > 14 ? "13px" : "18px",
            fontWeight: "bold",
          }}
        >
          {title}
        </BootstrapCard.Title>

        <div
          style={{
            wordBreak: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "normal",
            fontSize: "14px",
          }}
        >
          {contentHref ? (
            <a
              href={contentHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ wordBreak: "break-word" }}
            >
              {content}
            </a>
          ) : (
            content
          )}
        </div>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};
