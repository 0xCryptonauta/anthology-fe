import { useState, useMemo } from "react";
import { shortenAddress } from "@utils/shortenAddress";
import { useAppDispatch, useAppSelector } from "@store/utils/hooks";
import { syncUserContractsToStore } from "@src/store/utils/thunks";
import { Address, CurrentPaths } from "@src/types/common";
import { parseContractsCategoriesSorted } from "@src/utils/parseContractsCategories";
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

/**
 * Paleta de colores neon para categorías dinámicas.
 */
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

/**
 * Asigna un estilo neon dinámico basado en el hash de la categoría.
 * Usa una paleta de 15 colores para distribuir categorías diferentes.
 * El mismo nombre de categoría siempre recibe el mismo color (determinístico).
 */
const getCategoryStyles = (category: string): string => {
  // Generar hash consistente basado en el nombre de la categoría
  let hash = 0;
  const lower = category.toLowerCase();
  for (let i = 0; i < lower.length; i++) {
    hash = ((hash << 5) - hash) + lower.charCodeAt(i);
    hash = hash & hash;
  }
  const index = Math.abs(hash) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[index];
};

export const UserContracts: React.FC<UserContractsProps> = ({
  userAddr,
  userTitles,
}) => {
  const dispatch = useAppDispatch();
  const currentUserAddr = useAppSelector((state) => state.user.userAddr);

  /**
   * ESTADO SENIOR:
   * Al inicializar el Record como vacío {}, todos los booleanos por defecto serán false.
   * Por lo tanto, todas las categorías iniciarán COLAPSADAS (cerradas).
   */
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

  /**
   * OPTIMIZACIÓN DE RENDIMIENTO:
   * useMemo protege contra renders innecesarios.
   * El ordenamiento alfabético corre solo si las props cambian de valor.
   */
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
    <div className="flex flex-col items-center w-full p-2 text-zinc-100 min-h-screen">
      <div className="w-full max-w-xl p-2">
        
        {/* --- HEADER DE USUARIO --- */}
        <div className="flex justify-between items-center mb-6 p-4 bg-[#161b22] rounded-xl !border-sky-500/40 shadow-[0_0_15px_rgba(14,165,233,0.15)] ">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400 select-none">
              U
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-lg font-medium cursor-pointer hover:text-white transition-colors"
                onClick={() => {
                  if (userAddr === currentUserAddr) {
                    dispatch(syncUserContractsToStore(userAddr));
                  }
                }}
              >
                {userAddr === LOCAL_USER_ADDR ? "Local User" : shortenAddress(userAddr, 12, 9)}
              </span>
              {userAddr === LOCAL_USER_ADDR && (
                <span className="text-xs font-bold tracking-wider bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-md select-none">
                  NEW
                </span>
              )}
            </div>
          </div>
          {(currentUserAddr === userAddr || userAddr === LOCAL_USER_ADDR) && (
            <DeployButton isLocal={userAddr === LOCAL_USER_ADDR} />
          )}
        </div>

        {/* --- LISTA DE CATEGORÍAS --- */}
        <div className="space-y-4">
          {processedData.categories.map(([category, categoryData]) => {
            const { items, subcategories } = categoryData;
            
            // Si es undefined en el objeto de estado, por defecto será false (cerrado)
            const isExpanded = expandedCategories[category] || false; 
            const neonStyles = getCategoryStyles(category);

            return (
              <div
                key={category}
                className={`p-4 bg-[#161b22] rounded-xl transition-all duration-200 ${neonStyles}`}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer select-none mb-3"
                  onClick={() => toggleCategory(category)}
                >
                  <h3 className="text-lg font-bold tracking-wide">{category}</h3>
                  <span className="text-xs text-zinc-400 font-mono tracking-wider px-2 py-1 rounded">
                    {isExpanded ? "[-]" : "[+]"}
                  </span>
                </div>

                {isExpanded && (
                  <div className="animate-fadeIn">
                    {/* Items raíz de la categoría */}
                    <ul className="space-y-2 ml-2">
                      {items.map(({ address, title }) => (
                        <li key={address}>
                          <span
                            className="text-sm cursor-pointer text-zinc-300 hover:text-white transition-colors"
                            onClick={() => handleOnClick(`contract/${address}`)}
                          >
                            &middot; {title}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Subcategorías */}
                    {Object.entries(subcategories).map(([sub, subItems]) => (
                      <div key={sub} className="mt-4 p-3 bg-[#0d1117] rounded-lg border border-zinc-800">
                        <h5 className="text-sm font-semibold text-zinc-400 mb-2">{sub}</h5>
                        <ul className="space-y-1.5 ml-1">
                          {subItems.map(({ address, title }) => (
                            <li key={address}>
                              <span
                                className="text-sm cursor-pointer text-zinc-300 hover:text-white transition-colors"
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
            <div className="p-4 bg-[#161b22] rounded-xl border border-zinc-800">
              {
                (() => {
                  const isUncategorizedExpanded = expandedCategories["Uncategorized_General_Key"] || false;
                  return (
                    <>
                      <div 
                        className="flex justify-between items-center cursor-pointer select-none mb-3"
                        onClick={() => toggleCategory("Uncategorized_General_Key")}
                      >
                        <h3 className="text-lg font-bold">Other</h3>
                        <span className="text-xs text-zinc-400 font-mono bg-zinc-800/60 px-2 py-1 rounded">
                          {isUncategorizedExpanded ? "[-]" : "[+]"}
                        </span>
                      </div>

                      {isUncategorizedExpanded && (
                        <ul className="space-y-2 ml-2 animate-fadeIn">
                          {processedData.uncategorized.map(({ address, title }) => (
                            <li key={address}>
                              <span
                                className="text-sm cursor-pointer text-zinc-300 hover:text-white transition-colors"
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