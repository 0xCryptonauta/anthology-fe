//import { useNavigate } from "react-router-dom";
import { shortenAddress } from "@utils/shortenAddress";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { ActiveView } from "@src/types/common";
import { syncUserContractsToStore } from "@src/store/utils/thunks";
interface Contract {
  address: string;
  title: string;
  originalIndex: number;
}

interface Categories {
  [category: string]: {
    items: Contract[];
    subcategories: { [subcategory: string]: Contract[] };
  };
}

interface UsersPaginantedProps {
  setActiveView: (newActiveView: ActiveView) => void;
}

export const UsersPaginated: React.FC<UsersPaginantedProps> = ({
  setActiveView,
}) => {
  //const navigate = useNavigate();

  const { users, userContracts, contractsTitles } = useAppSelector(
    (state) => state.factory
  );

  const parseContracts = (
    contracts: Contract[]
  ): { categories: Categories; uncategorized: Contract[] } => {
    const categories: Categories = {};
    const uncategorized: Contract[] = [];

    contracts?.forEach(({ address, title, originalIndex }) => {
      if (!title.trim()) {
        uncategorized.push({ address, title, originalIndex });
        return;
      }

      const match =
        title.match(/\[(.*?)\](?:\[(.*?)\])?\s*(.*)$/) ||
        title.match(/^([^[]+)$/);

      if (match) {
        const [, category, subcategory, item] =
          match.length === 4 ? match : [null, null, null, match[1]];

        const contractData = {
          address,
          title: item?.trim() || title,
          originalIndex,
        };

        if (category) {
          if (!categories[category]) {
            categories[category] = { items: [], subcategories: {} };
          }

          if (subcategory) {
            if (!categories[category].subcategories[subcategory]) {
              categories[category].subcategories[subcategory] = [];
            }
            categories[category].subcategories[subcategory].push(contractData);
          } else {
            categories[category].items.push(contractData);
          }
        } else {
          uncategorized.push(contractData);
        }
      }
    });

    return { categories, uncategorized };
  };

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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      <div style={{ margin: "5px" }}>
        {users?.map((user, userIndex) => {
          const userTitles: Contract[] = userContracts[user]?.map(
            (contractAddr: string, index: number) => ({
              address: contractAddr,
              title: contractsTitles[contractAddr] || "",
              originalIndex: index,
            })
          );

          const { categories, uncategorized } = parseContracts(userTitles);

          return (
            <div key={userIndex}>
              <div>
                <span
                  style={{ cursor: "pointer", marginRight: "5px" }}
                  onClick={() => dispatch(syncUserContractsToStore(user))}
                >
                  👤
                </span>{" "}
                <span
                  style={{ fontSize: "20px", cursor: "pointer" }}
                  onClick={() => {
                    handleOnClick(`user/${user}`);
                  }}
                >
                  {shortenAddress(user, 12, 9)}
                </span>
                <div style={{ marginTop: "30px" }}>
                  {Object.entries(categories).map(
                    ([category, { items, subcategories }], index, arr) => (
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
                        {Object.entries(subcategories).map(
                          ([sub, subItems]) => (
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
                          )
                        )}
                        {index < arr.length - 1 && <hr className="my-2" />}
                      </div>
                    )
                  )}
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
                              {title.trim()
                                ? title
                                : shortenAddress(address, 12, 9)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <br />
            </div>
          );
        })}
      </div>
    </div>
  );
};
