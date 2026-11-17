import { useId, useMemo, useState, type CSSProperties } from "react";
import type { Address, MemoirContent } from "@src/types/common";
import { parseContractsCategoriesSorted } from "@src/utils/parseContractsCategories";
import type { PreviewAnthology } from "@src/utils/previewItems";
import { useTranslation } from "@src/i18n/useTranslation";

const headerButtonStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  background: "none",
  border: "none",
  padding: 0,
  color: "inherit",
  cursor: "pointer",
  textAlign: "left",
  font: "inherit",
};

const sectionStyle: CSSProperties = {
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  backgroundColor: "#f8fafc",
  padding: "6px 8px",
  boxSizing: "border-box",
  width: "330px",
  maxWidth: "100%",
  margin: "0 auto",
  textAlign: "left",
};

const listStyle: CSSProperties = {
  margin: 0,
  padding: 0,
  listStyle: "none",
};

const countStyle: CSSProperties = {
  color: "#64748b",
  fontSize: "12px",
  whiteSpace: "nowrap",
};

const indicatorStyle: CSSProperties = {
  color: "#64748b",
  fontSize: "12px",
  fontFamily: "monospace",
};

export const PreviewCategoryTree = ({
  items,
  single,
}: {
  items: PreviewAnthology[];
  single: boolean;
}) => {
  const { t } = useTranslation();
  const baseId = useId();
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [expandedSubcategories, setExpandedSubcategories] = useState<
    Record<string, boolean>
  >({});

  const memoirContents = useMemo<MemoirContent[]>(
    () =>
      items.map((item, index) => ({
        address: item.address,
        title: item.title,
        originalIndex: index,
      })),
    [items]
  );

  const counts = useMemo(
    () =>
      new Map<Address, number>(
        items.map((item) => [item.address, item.memoirCount])
      ),
    [items]
  );

  const { categories, uncategorized } = useMemo(
    () => parseContractsCategoriesSorted(memoirContents),
    [memoirContents]
  );

  const memoirLabel = (count: number) =>
    count === 1
      ? t("connect.memoirCountOne")
      : t("connect.memoirCount", { count });

  const renderItem = (item: MemoirContent) => (
    <li
      key={item.address}
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: "8px",
        padding: "3px 0",
      }}
    >
      <span
        translate="no"
        style={{
          fontSize: "15px",
          color: "#1a1a1a",
          overflowWrap: "anywhere",
        }}
      >
        {item.title}
      </span>
      <span style={countStyle}>
        {memoirLabel(counts.get(item.address) ?? 0)}
      </span>
    </li>
  );

  if (single) {
    const only = items[0];
    if (!only) return null;

    const categoryEntry = Object.entries(categories)[0];
    const subcategoryEntry = categoryEntry
      ? Object.entries(categoryEntry[1].subcategories)[0]
      : undefined;
    const label = categoryEntry
      ? subcategoryEntry
        ? `${categoryEntry[0]} › ${subcategoryEntry[0]}`
        : categoryEntry[0]
      : null;
    const parsedItem =
      subcategoryEntry?.[1][0] ??
      categoryEntry?.[1].items[0] ??
      uncategorized[0];

    return (
      <div style={sectionStyle} data-preview-card>
        {label && (
          <div
            translate="no"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#64748b",
              marginBottom: "2px",
            }}
          >
            {label}
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <span
            translate="no"
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "#1a1a1a",
              overflowWrap: "anywhere",
            }}
          >
            {parsedItem?.title ?? only.title}
          </span>
          <span style={countStyle}>{memoirLabel(only.memoirCount)}</span>
        </div>
      </div>
    );
  }

  // No bracketed titles: keep the flat list the preview had before.
  if (Object.keys(categories).length === 0) {
    return (
      <ul
        style={{
          ...listStyle,
          textAlign: "left",
          width: "330px",
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        {uncategorized.map(renderItem)}
      </ul>
    );
  }

  const otherExpanded = expandedCategories.__other__ ?? false;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        width: "100%",
        textAlign: "left",
      }}
    >
      {Object.entries(categories).map(([category, data], categoryIndex) => {
        const isExpanded = expandedCategories[category] ?? false;
        const contentId = `${baseId}-category-${categoryIndex}`;
        const total =
          data.items.length +
          Object.values(data.subcategories).reduce(
            (sum, list) => sum + list.length,
            0
          );

        return (
          <section key={category} style={sectionStyle} data-preview-card>
            <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 600 }}>
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={contentId}
                onClick={() =>
                  setExpandedCategories((previous) => ({
                    ...previous,
                    [category]: !isExpanded,
                  }))
                }
                style={headerButtonStyle}
              >
                <span translate="no">{category}</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={countStyle}>{total}</span>
                  <span aria-hidden="true" style={indicatorStyle}>
                    {isExpanded ? "▾" : "▸"}
                  </span>
                </span>
              </button>
            </h4>

            <div id={contentId} hidden={!isExpanded} style={{ marginTop: "4px" }}>
              {data.items.length > 0 && (
                <ul style={listStyle}>{data.items.map(renderItem)}</ul>
              )}

              {Object.entries(data.subcategories).map(
                ([sub, subItems], subIndex) => {
                  const subKey = `${category}::${sub}`;
                  const subExpanded = expandedSubcategories[subKey] ?? false;
                  const subContentId = `${baseId}-subcategory-${categoryIndex}-${subIndex}`;

                  return (
                    <div
                      key={sub}
                      style={{
                        marginTop: "4px",
                        borderTop: "1px solid #e2e8f0",
                        paddingTop: "4px",
                      }}
                    >
                      <h5
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          color: "#475569",
                        }}
                      >
                        <button
                          type="button"
                          aria-expanded={subExpanded}
                          aria-controls={subContentId}
                          onClick={() =>
                            setExpandedSubcategories((previous) => ({
                              ...previous,
                              [subKey]: !subExpanded,
                            }))
                          }
                          style={headerButtonStyle}
                        >
                          <span translate="no">{sub}</span>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <span style={countStyle}>{subItems.length}</span>
                            <span aria-hidden="true" style={indicatorStyle}>
                              {subExpanded ? "▾" : "▸"}
                            </span>
                          </span>
                        </button>
                      </h5>

                      <div id={subContentId} hidden={!subExpanded}>
                        <ul style={listStyle}>{subItems.map(renderItem)}</ul>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </section>
        );
      })}

      {uncategorized.length > 0 && (
        <section style={sectionStyle} data-preview-card>
          <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 600 }}>
            <button
              type="button"
              aria-expanded={otherExpanded}
              aria-controls={`${baseId}-other`}
              onClick={() =>
                setExpandedCategories((previous) => ({
                  ...previous,
                  __other__: !otherExpanded,
                }))
              }
              style={headerButtonStyle}
            >
              <span>{t("common.other")}</span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={countStyle}>{uncategorized.length}</span>
                <span aria-hidden="true" style={indicatorStyle}>
                  {otherExpanded ? "▾" : "▸"}
                </span>
              </span>
            </button>
          </h4>

          <div
            id={`${baseId}-other`}
            hidden={!otherExpanded}
            style={{ marginTop: "4px" }}
          >
            <ul style={listStyle}>{uncategorized.map(renderItem)}</ul>
          </div>
        </section>
      )}
    </div>
  );
};
