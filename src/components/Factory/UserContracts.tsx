import { useState, useMemo } from "react";
import { shortenAddress } from "@utils/shortenAddress";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { syncUserContractsToStore } from "@src/store/utils/thunks";
import { Address, CurrentPaths } from "@src/types/common";
import { parseContractsCategoriesSorted } from "@src/utils/parseContractsCategories";
import { DeployButton } from "./DeployButton";
import { LOCAL_USER_ADDR } from "@src/utils/constants";
import { updateCurrentPath } from "@src/store/slices/userSlice";
import "@src/styles/backgrounds.css";
import { getBgClass, hashString } from "@utils/backgrounds";

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

const CATEGORY_COLORS = [
  "border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
  "border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.15)]",
  "border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]",
  "border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]",
  "border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.15)]",
  "border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.15)]",
  "border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.15)]",
  "border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
  "border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
  "border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]",
  "border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
  "border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]",
  "border-lime-500/40 shadow-[0_0_15px_rgba(132,204,22,0.15)]",
  "border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.15)]",
  "border-fuchsia-500/40 shadow-[0_0_15px_rgba(217,70,239,0.15)]",
];

const getCategoryStyles = (category: string) =>
  CATEGORY_COLORS[hashString(category) % CATEGORY_COLORS.length];

export const UserContracts: React.FC<UserContractsProps> = ({
  userAddr,
  userTitles,
}) => {
  const dispatch = useAppDispatch();
  const currentUserAddr = useAppSelector((state) => state.user.userAddr);
  const categoryBackgroundsEnabled = useAppSelector((s) => s.dapp.categoryBackgroundsEnabled);

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const handleOnClick = (newCurrentPath: CurrentPaths) => {
    dispatch(updateCurrentPath(newCurrentPath));
    window.history.pushState({ currentPath: newCurrentPath }, "", window.location.pathname);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const processedData = useMemo(() => {
    const { categories, uncategorized } = parseContractsCategoriesSorted(userTitles);

    const sortedCategories = Object.entries(categories).map(([category, data]) => {
      return [
        category,
        {
          items: [...data.items].sort((a, b) => a.title.localeCompare(b.title)),
          subcategories: Object.entries(data.subcategories).reduce((acc, [sub, subItems]) => {
            acc[sub] = [...subItems].sort((a, b) => a.title.localeCompare(b.title));
            return acc;
          }, {} as { [subcategory: string]: MemoirContent[] }),
        },
      ] as const;
    });

    const sortedUncategorized = [...uncategorized].sort((a, b) => a.title.localeCompare(b.title));

    return { categories: sortedCategories, uncategorized: sortedUncategorized };
  }, [userTitles]);


  return (
    <div className="flex flex-col items-center w-full p-6 text-zinc-100 min-h-screen">
      <div className="w-full max-w-7xl">

        {/* --- HEADER DE USUARIO --- */}
        <div className={`flex justify-between items-center mb-8 p-4 ${categoryBackgroundsEnabled && userAddr === LOCAL_USER_ADDR ? "bg-overlay bg-nested-triangles" : "bg-[#161b22]"} rounded-xl border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.15)] mx-auto w-full max-w-2xl`}>
          <div className="flex items-center gap-4">
{/*             {userAddr === LOCAL_USER_ADDR && (
                <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400 select-none">
              PA
            </div>
              )} */}
            
            <div className="flex items-center gap-2">
              <span
                className="text-2xl font-medium hover:text-white transition-colors"
                onClick={() => {
                  if (userAddr === currentUserAddr) {
                    dispatch(syncUserContractsToStore(userAddr));
                  }
                }}
              >
                {userAddr === LOCAL_USER_ADDR ? "Private Anthology" : shortenAddress(userAddr, 12, 9)}
              </span>
              {userAddr === LOCAL_USER_ADDR && (
                <span className="text-xs font-bold tracking-wider bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-md select-none">
                  LOCAL
                </span>
              )}
            </div>
          </div>
          {(currentUserAddr === userAddr || userAddr === LOCAL_USER_ADDR) && (
            <DeployButton isLocal={userAddr === LOCAL_USER_ADDR} />
          )}
        </div>

        {/* --- LISTA DE CATEGORÍAS (MASONRY LAYOUT) --- */}
        {/* 🟢 CAMBIO AQUI: Usamos columns-1, md:columns-2, etc., en lugar de flex */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full items-start">
          {processedData.categories.map(([category, categoryData]) => {
            const { items, subcategories } = categoryData;
            const isExpanded = expandedCategories[category] || false; 
            const neonStyles = getCategoryStyles(category);

            return (
              <div
                key={category}
                /* 🟢 CAMBIO AQUI: break-inside-avoid e inline-block son críticos para que 
                   la tarjeta no se corte a la mitad entre dos columnas */
                className={`p-4 ${categoryBackgroundsEnabled ? getBgClass(category) : ""} rounded-xl transition-all duration-200 ${neonStyles}`}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer select-none"
                  onClick={() => toggleCategory(category)}
                >
                  <h3 className="text-lg font-bold tracking-wide">{category}</h3>
                  <span className="text-xs text-white/50 font-mono tracking-wider px-2 py-1 rounded">
                    {isExpanded ? "[-]" : "[+]"}
                  </span>
                </div>

                {isExpanded && (
                  <div className="animate-fadeIn mt-4">
                    <ul className="space-y-2 ml-2">
                      {items.map(({ address, title }) => (
                        <li key={address}>
                          <span
                            className="text-lg cursor-pointer text-white hover:text-white transition-colors"
                            onClick={() => handleOnClick(`contract/${address}`)}
                          >
                            &middot; {title}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {Object.entries(subcategories).map(([sub, subItems]) => (
                      <div key={sub} className="mt-4 p-3 rounded-lg border-zinc-800">
                        <h5 className="text-lg font-semibold text-white mb-2">{sub}</h5>
                        <ul className="space-y-1.5 ml-1">
                          {subItems.map(({ address, title }) => (
                            <li key={address}>
                              <span
                                className="text-lg cursor-pointer text-white hover:text-white transition-colors"
                                onClick={() => handleOnClick(`contract/${address}`)}
                              >
                                &middot; {title}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* --- (UNCATEGORIZED) --- */}
          {processedData.uncategorized.length > 0 && (
            <div className={`p-4 ${categoryBackgroundsEnabled ? getBgClass("uncategorized") : ""} rounded-xl border-zinc-800`}>
              {
                (() => {
                  const isUncategorizedExpanded = expandedCategories["Uncategorized_General_Key"] || false;
                  return (
                    <>
                      <div 
                        className="flex justify-between items-center cursor-pointer select-none"
                        onClick={() => toggleCategory("Uncategorized_General_Key")}
                      >
                        <h3 className="text-lg font-bold">Other</h3>
                        <span className="text-xs text-white/50 font-mono bg-zinc-800/60 px-2 py-1 rounded">
                          {isUncategorizedExpanded ? "[-]" : "[+]"}
                        </span>
                      </div>

                      {isUncategorizedExpanded && (
                        <ul className="space-y-2 ml-2 animate-fadeIn mt-4">
                          {processedData.uncategorized.map(({ address, title }) => (
                            <li key={address}>
                              <span
                                className="text-sm cursor-pointer text-white hover:text-white transition-colors"
                                onClick={() => handleOnClick(`contract/${address}`)}
                              >
                                &middot; {title.trim() ? title : shortenAddress(address, 12, 9)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  );
                })()
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};