import { useState, useMemo, useId, useRef, useEffect } from "react";
import { MAX_TITLE_LENGTH } from "@src/utils/constants";
import { MemoirContent } from "@src/types/common";
import { parseContractsCategoriesSorted } from "@src/utils/parseContractsCategories";
import "./TitleEditor.css";

interface TitleEditorProps {
  initialTitle?: string;
  userTitles?: MemoirContent[];
  submitLabel: string;
  onSubmit: (combined: string) => void;
}

const parseExistingTitle = (title: string) => {
  const match = title.match(/\[(.*?)\](?:\[(.*?)\])?\s*(.*)$/);
  if (match) {
    return {
      category: match[1]?.trim() || "",
      subcategory: match[2]?.trim() || "",
      title: match[3]?.trim() || title,
    };
  }
  return { category: "", subcategory: "", title: title.trim() };
};

export const TitleEditor: React.FC<TitleEditorProps> = ({
  initialTitle = "",
  userTitles,
  submitLabel,
  onSubmit,
}) => {
  const parsed = useMemo(() => parseExistingTitle(initialTitle), [initialTitle]);

  const [category, setCategory] = useState(parsed.category);
  const [subcategory, setSubcategory] = useState(parsed.subcategory);
  const [title, setTitle] = useState(parsed.title);

  const catId = useId();
  const subId = useId();
  const titleId = useId();

  const catRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [subDropdownOpen, setSubDropdownOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatDropdownOpen(false);
      }
      if (subRef.current && !subRef.current.contains(e.target as Node)) {
        setSubDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  const availableCategories = useMemo(() => {
    if (!userTitles?.length) return [];
    const { categories } = parseContractsCategoriesSorted(userTitles);
    return Object.keys(categories);
  }, [userTitles]);

  const filteredCategories = useMemo(() => {
    if (!category.trim()) return availableCategories;
    return availableCategories.filter((c) =>
      c.toLowerCase().includes(category.trim().toLowerCase())
    );
  }, [availableCategories, category]);

  const availableSubcategories = useMemo(() => {
    if (!userTitles?.length || !category.trim()) return [];
    const { categories } = parseContractsCategoriesSorted(userTitles);
    return Object.keys(categories[category.trim()]?.subcategories || {});
  }, [userTitles, category]);

  const filteredSubcategories = useMemo(() => {
    if (!subcategory.trim()) return availableSubcategories;
    return availableSubcategories.filter((s) =>
      s.toLowerCase().includes(subcategory.trim().toLowerCase())
    );
  }, [availableSubcategories, subcategory]);

  const combinedTitle = useMemo(() => {
    const cat = category.trim();
    const sub = subcategory.trim();
    const t = title.trim();
    let result = "";
    if (cat) result += `[${cat}]`;
    if (cat && sub) result += `[${sub}]`;
    result += t;
    return result;
  }, [category, subcategory, title]);

  const charCount = combinedTitle.length;
  const charRatio = Math.min(charCount / MAX_TITLE_LENGTH, 1);
  const barColor =
    charCount > MAX_TITLE_LENGTH - 5
      ? "#ef4444"
      : charCount > MAX_TITLE_LENGTH - 15
        ? "#f59e0b"
        : "#22d3ee";

  const canSubmit = title.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(combinedTitle);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="title-editor">
      <div className="title-editor-field">
        <label htmlFor={catId}>Category (Optional)</label>
        <div className="title-editor-input-wrap" ref={catRef}>
          <input
            id={catId}
            type="text"
            placeholder="e.g. Art, Music, Tech..."
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (!e.target.value) setSubcategory("");
            }}
            onFocus={() => setCatDropdownOpen(true)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          {catDropdownOpen && filteredCategories.length > 0 && (
            <div className="title-editor-dropdown">
              {filteredCategories.map((c) => (
                <div
                  key={c}
                  className="title-editor-dropdown-item"
                  onMouseDown={() => {
                    setCategory(c);
                    setCatDropdownOpen(false);
                  }}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="title-editor-field">
        <label htmlFor={subId}>Subcategory (Optional)</label>
        <div className="title-editor-input-wrap" ref={subRef}>
          <input
            id={subId}
            type="text"
            placeholder={category.trim() ? "e.g. Paintings, 80s..." : "Enter a category first"}
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            onFocus={() => setSubDropdownOpen(true)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            disabled={!category.trim()}
          />
          {subDropdownOpen && filteredSubcategories.length > 0 && (
            <div className="title-editor-dropdown">
              {filteredSubcategories.map((s) => (
                <div
                  key={s}
                  className="title-editor-dropdown-item"
                  onMouseDown={() => {
                    setSubcategory(s);
                    setSubDropdownOpen(false);
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="title-editor-field">
        <label htmlFor={titleId} style={{color: "black", fontWeight: "bold"}}>Title</label>
        <input
          id={titleId}
          type="text"
          placeholder="My Anthology"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
      </div>



      <div>
        {/* <div className="title-editor-preview">
          <div className="title-editor-preview-label">Preview</div>
          {combinedTitle ? (
            <div className="title-editor-preview-text">
              {category.trim() && (
                <span className="preview-category">[{category.trim()}]</span>
              )}
              {category.trim() && subcategory.trim() && (
                <span className="preview-subcategory">[{subcategory.trim()}]</span>
              )}
              <span className="preview-title">{title.trim()}</span>
            </div>
          ) : (
            <div className="title-editor-preview-empty">Type a title to see preview</div>
          )}
        </div> */}

        <div className="title-editor-tree">
          <div className="title-editor-tree-label">Structure</div>
          {title.trim() || category.trim() ? (
            <div className="title-editor-tree-content">
              {category.trim() && (
                <div className="tree-category">
                  <span className="tree-bullet">&#x2503;</span> {category.trim()}
                </div>
              )}
              {category.trim() && subcategory.trim() && (
                <div className="tree-subcategory">
                  <span className="tree-bullet">&#x2503;</span> {subcategory.trim()}
                </div>
              )}
              {title.trim() && (
                <div className="tree-title">
                  <span className="tree-bullet tree-bullet-end">&#x2517;</span> {title.trim()}
                </div>
              )}
            </div>
          ) : (
            <div className="title-editor-tree-empty">No structure to show</div>
          )}
        </div>
      </div>



      <div className="title-editor-counter">
        <div className="title-editor-counter-bar">
          <div
            className="title-editor-counter-fill"
            style={{ width: `${charRatio * 100}%`, backgroundColor: barColor }}
          />
        </div>
        <span className="title-editor-counter-text">
          {charCount} / {MAX_TITLE_LENGTH}
        </span>
      </div>

      <button
        className="title-editor-submit"
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        {submitLabel}
      </button>
    </div>
  );
};
