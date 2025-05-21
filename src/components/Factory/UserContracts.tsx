import { shortenAddress } from "@utils/shortenAddress";
import { useAppDispatch } from "@store/utils/hooks";
import { syncUserContractsToStore } from "@src/store/utils/thunks";
import { ActiveView, Address } from "@src/types/common";
import { parseContractsCategories } from "@src/utils/parseContractsCategories";
import { DeployButton } from "./DeployButton";
import { LOCAL_USER_ADDR } from "@src/utils/constants";

export interface MemoirContent {
  address: Address;
  title: string;
  originalIndex: number;
}

export interface Categories {
  [category: string]: {
    items: MemoirContent[];
    subcategories: { [subcategory: string]: MemoirContent[] };
  };
}
interface UserContractsProps {
  userAddr: Address;
  userTitles: MemoirContent[];
  setActiveView: (newActiveView: ActiveView) => void;
}

export const UserContracts: React.FC<UserContractsProps> = ({
  setActiveView,
  userAddr,
  userTitles,
}) => {
  const dispatch = useAppDispatch();

  const handleOnClick = (newActiveView: ActiveView) => {
    setActiveView(newActiveView); // Update local state

    // Push new history entry without changing URL
    window.history.pushState(
      { activeView: newActiveView }, // Store component name in history.state
      "", // Unused title
      window.location.pathname // Keep URL as `/`
    );
  };

  const { categories, uncategorized } = parseContractsCategories(userTitles);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        //border: "1px solid white",
        width: "100%",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      <div style={{ margin: "5px" }}>
        <span
          style={{ cursor: "pointer", marginRight: "5px" }}
          onClick={() => dispatch(syncUserContractsToStore(userAddr))}
        >
          👤
        </span>{" "}
        <span
          style={{ fontSize: "20px", cursor: "pointer" }}
          onClick={() => {}}
        >
          {userAddr === LOCAL_USER_ADDR
            ? "Local User: 0x0000...0000"
            : shortenAddress(userAddr, 12, 9)}
        </span>
        <DeployButton isLocal={userAddr === LOCAL_USER_ADDR ? true : false} />
        <div style={{ marginTop: "30px" }}>
          {Object.entries(categories)
            .sort(([categoryA], [categoryB]) =>
              categoryA.localeCompare(categoryB)
            )
            .map(([category, { items, subcategories }], index, arr) => (
              <div key={category}>
                <h3 className="text-lg font-semibold">{category}</h3>
                <ul className="ml-4">
                  {items.map(({ address, title }) => (
                    <li key={address}>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          handleOnClick(`contract/${address}`);
                        }}
                      >
                        {title}
                      </span>
                    </li>
                  ))}
                </ul>
                {Object.entries(subcategories).map(([sub, subItems]) => (
                  <div
                    key={sub}
                    className="ml-12"
                    style={{ marginLeft: "1em" }}
                  >
                    <h5 className="text-md font-medium">{sub}</h5>
                    <ul className="ml-12">
                      {subItems.map(({ address, title }) => (
                        <li key={address}>
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              handleOnClick(`contract/${address}`);
                            }}
                          >
                            {title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {index < arr.length - 1 && <hr className="my-2" />}
              </div>
            ))}
          {uncategorized.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">Other</h3>
              <ul className="ml-4">
                {uncategorized.map(({ address, title }) => (
                  <li key={address}>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        handleOnClick(`contract/${address}`);
                      }}
                    >
                      {title.trim() ? title : shortenAddress(address, 12, 9)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
