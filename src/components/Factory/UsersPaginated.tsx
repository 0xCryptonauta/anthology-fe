import { useNavigate } from "react-router-dom";
import { copyToClipboard } from "@utils/copyToClipboard";
import { shortenAddress } from "@utils/shortenAddress";
import { useAppSelector } from "@store/utils/hooks";

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

export const UsersPaginated = () => {
  const navigate = useNavigate();
  const { users, userContracts, contractsTitles } = useAppSelector(
    (state) => state.factory
  );

  const parseContracts = (
    contracts: Contract[]
  ): { categories: Categories; uncategorized: Contract[] } => {
    const categories: Categories = {};
    const uncategorized: Contract[] = [];

    contracts.forEach(({ address, title, originalIndex }) => {
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        //width: "350px",
        padding: "7px",
        borderRadius: "7px",
        margin: "5px",
      }}
    >
      <div style={{ margin: "5px" }}>
        {users?.map((user, userIndex) => {
          const userTitles: Contract[] = userContracts[user].map(
            (contractAddr: string, index: number) => ({
              address: contractAddr,
              title: contractsTitles[contractAddr],
              originalIndex: index,
            })
          );

          const { categories, uncategorized } = parseContracts(userTitles);

          return (
            <div key={userIndex}>
              <div>
                <span
                  style={{ fontSize: "20px", cursor: "pointer" }}
                  onClick={() => navigate("/" + user)}
                >
                  👤 {shortenAddress(user, 12, 9)}
                </span>
                <div style={{ marginTop: "30px" }}>
                  {Object.entries(categories).map(
                    ([category, { items, subcategories }], index, arr) => (
                      <div key={category}>
                        <h3 className="text-lg font-semibold">{category}</h3>
                        <ul className="ml-4">
                          {items.map(({ address, title, originalIndex }) => (
                            <li key={address}>
                              💾{" "}
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  navigate(`/${user}/${originalIndex}`)
                                }
                              >
                                {title}
                              </span>
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={() => copyToClipboard(address)}
                              >
                                {" "}
                                🔗
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
                                {subItems.map(
                                  ({ address, title, originalIndex }) => (
                                    <li key={address}>
                                      💾{" "}
                                      <span
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          navigate(`/${user}/${originalIndex}`)
                                        }
                                      >
                                        {title}
                                      </span>
                                      <span
                                        style={{ cursor: "pointer" }}
                                        onClick={() => copyToClipboard(address)}
                                      >
                                        {" "}
                                        🔗
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )
                        )}
                        {/* Category divider */}
                        {index < arr.length - 1 && <hr className="my-2" />}
                      </div>
                    )
                  )}
                  {uncategorized.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold">Other</h3>
                      <ul className="ml-4">
                        {uncategorized.map(
                          ({ address, title, originalIndex }) => (
                            <li key={address}>
                              💾{" "}
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  navigate(`/${user}/${originalIndex}`)
                                }
                              >
                                {title}
                              </span>
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={() => copyToClipboard(address)}
                              >
                                {" "}
                                🔗
                              </span>
                            </li>
                          )
                        )}
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
