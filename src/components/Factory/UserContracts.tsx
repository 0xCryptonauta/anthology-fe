import { shortenAddress } from "@utils/shortenAddress";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { syncUserContractsToStore } from "@src/store/utils/thunks";
import { Address, CurrentPaths } from "@src/types/common";
import { parseContractsCategories } from "@src/utils/parseContractsCategories";
import { DeployButton } from "./DeployButton";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { updateCurrentPath } from "@src/store/slices/userSlice";

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
}

export const UserContracts: React.FC<UserContractsProps> = ({
  userAddr,
  userTitles,
}) => {
  const dispatch = useAppDispatch();

  const currentUserAddr = useAppSelector((state) => state.user.userAddr);

  const handleOnClick = (newCurrentPath: CurrentPaths) => {
    dispatch(updateCurrentPath(newCurrentPath)); // Update local state

    // Push new history entry without changing URL
    window.history.pushState(
      { currentPath: newCurrentPath }, // Store component name in history.state
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{ cursor: "pointer", marginRight: "15px" }}
            onClick={() => {
              if (userAddr === currentUserAddr) {
                dispatch(syncUserContractsToStore(userAddr));
              } else if (userAddr === LOCAL_USER_ADDR) {
                console.log("Do nothing");
              }
            }}
          >
            👤
          </span>{" "}
          <span
            style={{ fontSize: "20px", cursor: "pointer" }}
            onClick={() => {}}
          >
            {userAddr === LOCAL_USER_ADDR
              ? "Local User"
              : shortenAddress(userAddr, 12, 9)}
          </span>
          {(currentUserAddr === userAddr || userAddr === LOCAL_USER_ADDR) && (
            <DeployButton isLocal={userAddr === LOCAL_USER_ADDR} />
          )}
        </div>

        <div style={{ marginTop: "30px" }}>
          {Object.entries(categories)
            .sort(([categoryA], [categoryB]) =>
              categoryA.localeCompare(categoryB)
            )
            .map(([category, categoryData], index, arr) => {
              const { items = [], subcategories = {} } = categoryData;

              return (
                <div key={category}>
                  <h3 className="text-lg font-semibold">{category}</h3>
                  <ul className="ml-4">
                    {items
                      .sort((a, b) => a.title.localeCompare(b.title))
                      .map(({ address, title }) => (
                        <li key={address}>
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => handleOnClick(`contract/${address}`)}
                          >
                            {title}
                          </span>
                        </li>
                      ))}
                  </ul>

                  {Object.entries(subcategories)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([sub, subItems]) => (
                      <div
                        key={sub}
                        className="ml-12"
                        style={{ marginLeft: "1em" }}
                      >
                        <h5 className="text-md font-medium">{sub}</h5>
                        <ul className="ml-12">
                          {subItems
                            .sort((a, b) => a.title.localeCompare(b.title))
                            .map(({ address, title }) => (
                              <li key={address}>
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    handleOnClick(`contract/${address}`)
                                  }
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
              );
            })}

          {uncategorized.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">Other</h3>
              <ul className="ml-4">
                {uncategorized
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map(({ address, title }) => (
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
