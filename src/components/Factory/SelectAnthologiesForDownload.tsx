import { useMemo, useState } from "react";
import { MemoirContent } from "@src/types/common";
import { parseContractsCategoriesSorted } from "@src/utils/parseContractsCategories";
import { Modal } from "@components/Layout/Modal";
import { shortenAddress } from "@utils/shortenAddress";
import "./SelectAnthologiesForDownload.css";

interface SelectAnthologiesForDownloadProps {
  show?: boolean;
  onHide?: () => void;
  inline?: boolean;
  userTitles: MemoirContent[];
  onDownload: (selected: Set<string>) => void;
}

export const SelectAnthologiesForDownload: React.FC<SelectAnthologiesForDownloadProps> = ({
  show,
  onHide,
  inline,
  userTitles,
  onDownload,
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

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

  const toggleItem = (address: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(address)) {
        next.delete(address);
      } else {
        next.add(address);
      }
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(userTitles.map((t) => t.address)));
  const deselectAll = () => setSelected(new Set());

  const handleDownload = () => {
    if (selected.size === 0) return;
    onDownload(selected);
  };

  const renderItem = (item: MemoirContent, className?: string) => (
    <div key={item.address} className={`sel-item${className ? ` ${className}` : ""}`}>
      <label>
        <input
          type="checkbox"
          checked={selected.has(item.address)}
          onChange={() => toggleItem(item.address)}
        />
        <span>{item.title.trim() || shortenAddress(item.address, 8, 6)}</span>
      </label>
    </div>
  );

  const content = (
    <div>
      <button className="sel-back-btn" onClick={() => onHide?.()}>
        ← Back
      </button>
      <div className="sel-header m-2">Select Anthologies</div>

      <div className="sel-actions m-3">
        <button className="sel-action-btn" onClick={selectAll}>
          Select All
        </button>
        <button className="sel-action-btn" onClick={deselectAll}>
          Deselect All
        </button>
      </div>

      <div className="sel-list  my-3">
        {processedData.categories.length === 0 && processedData.uncategorized.length === 0 ? (
          <div className="sel-empty">No anthologies available</div>
        ) : (
          <>
            {processedData.uncategorized.length > 0 && (
              <div>
                <div className="sel-category">Other</div>
                {processedData.uncategorized.map((item) => renderItem(item))}
              </div>
            )}
            {processedData.categories.map(([category, categoryData]) => (
              <div key={category}>
                <div className="sel-category">{category}</div>
                {categoryData.items.map((item) => renderItem(item))}
                {categoryData.subcategories &&
                  Object.entries(categoryData.subcategories).map(([sub, subItems]) => (
                    <div key={sub}>
                      <div className="sel-subcategory">{sub}</div>
                      {subItems.map((item) => renderItem(item, "sel-item-sub"))}
                    </div>
                  ))}
              </div>
            ))}
          </>
        )}
      </div>

      <div className="sel-footer">
        <span className="sel-count">
          {selected.size} selected
        </span>
        <button className="sel-download-btn" disabled={selected.size === 0} onClick={handleDownload}>
          Download ({selected.size})
        </button>
      </div>
    </div>
  );

  if (inline) return content;

  return (
    <Modal placement="bottom" show={show} onHide={onHide}>
      <div className="sel-modal-content">{content}</div>
    </Modal>
  );
};
