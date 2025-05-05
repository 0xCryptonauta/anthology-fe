import { Categories, Contract } from "@src/components/Factory/UserContracts";

export const parseContractsCategories = (
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
