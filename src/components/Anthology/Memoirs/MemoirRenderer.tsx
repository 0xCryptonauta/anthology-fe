import { OrderType } from "@src/components/Layout/OrderSelector";
import { Address, SkinType } from "@src/types/common";
import {
  MediaMemoirSkin,
  JsonMemoirSkin,
  TextMemoirSkin,
  ListMemoirSkin,
  PlaylistMemoirSkin,
} from "./memoirSkins";

interface RenderMemoirsProps {
  order: OrderType;
  anthologyAddr: Address;
  skin: SkinType;
}

export const MemoirRenderer: React.FC<RenderMemoirsProps> = ({
  order,
  anthologyAddr,
  skin,
}) => {
  try {
    switch (skin) {
      case "json":
        return <JsonMemoirSkin anthologyAddr={anthologyAddr} order={order} />;
      case "media":
        return <MediaMemoirSkin anthologyAddr={anthologyAddr} order={order} />;
      case "text":
        return <TextMemoirSkin anthologyAddr={anthologyAddr} order={order} />;
      case "list":
        return <ListMemoirSkin anthologyAddr={anthologyAddr} order={order} />;

      case "playlist":
        return (
          <PlaylistMemoirSkin anthologyAddr={anthologyAddr} order={order} />
        );
      default:
        return <MediaMemoirSkin anthologyAddr={anthologyAddr} order={order} />;
    }
  } catch (error) {
    console.error("Error rendering RenderMemoirs:", error);
    return <div>Error rendering RenderMemoirs</div>;
  }
};
