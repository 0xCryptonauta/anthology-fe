import {
  Categories,
  MemoirContent,
} from "@src/components/Factory/UserContracts";

export const parseContractsCategories = (
  contracts: MemoirContent[]
): { categories: Categories; uncategorized: MemoirContent[] } => {
  const categories: Categories = {};
  const uncategorized: MemoirContent[] = [];

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

// Note: Objects in JS preserve insertion order, but callers often iterate keys
// expecting alphabetical order. Provide a helper to produce a new Categories
// object with sorted category and subcategory keys (alphabetically).
export const parseContractsCategoriesSorted = (
  contracts: MemoirContent[]
): { categories: Categories; uncategorized: MemoirContent[] } => {
  const { categories, uncategorized } = parseContractsCategories(contracts);

  const sortedCategories: Categories = {};

  Object.keys(categories)
    .sort((a, b) => a.localeCompare(b))
    .forEach((catKey) => {
      const cat = categories[catKey];
      const sortedSubcats: Categories[string]["subcategories"] = {};

      Object.keys(cat.subcategories)
        .sort((a, b) => a.localeCompare(b))
        .forEach((subKey) => {
          sortedSubcats[subKey] = cat.subcategories[subKey];
        });

      sortedCategories[catKey] = {
        items: cat.items,
        subcategories: sortedSubcats,
      };
    });

  return { categories: sortedCategories, uncategorized };
};
