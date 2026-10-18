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
  search?: string;
}

export const MemoirRenderer: React.FC<RenderMemoirsProps> = ({
  order,
  anthologyAddr,
  skin,
  search,
}) => {
  try {
    switch (skin) {
      case "json":
        return (
          <JsonMemoirSkin
            anthologyAddr={anthologyAddr}
            order={order}
            search={search}
          />
        );
      case "media":
        return (
          <MediaMemoirSkin
            anthologyAddr={anthologyAddr}
            order={order}
            search={search}
          />
        );
      case "text":
        return (
          <TextMemoirSkin
            anthologyAddr={anthologyAddr}
            order={order}
            search={search}
          />
        );
      case "list":
        return (
          <ListMemoirSkin
            anthologyAddr={anthologyAddr}
            order={order}
            search={search}
          />
        );

      case "playlist":
        return (
          <PlaylistMemoirSkin
            anthologyAddr={anthologyAddr}
            order={order}
            search={search}
          />
        );
      default:
        // Fallback (incl. on-chain default/unknown skin) follows DEFAULT_SKIN
        return (
          <ListMemoirSkin
            anthologyAddr={anthologyAddr}
            order={order}
            search={search}
          />
        );
    }
  } catch (error) {
    console.error("Error rendering RenderMemoirs:", error);
    return <div>Error rendering RenderMemoirs</div>;
  }
};
