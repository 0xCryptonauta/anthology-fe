import { useState, useMemo, useId } from "react";
import { MAX_TITLE_LENGTH } from "@src/utils/constants";
import { MemoirContent } from "@src/types/common";
import { parseContractsCategories } from "@src/utils/parseContractsCategories";
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
  const catListId = useId();
  const subListId = useId();

  const availableCategories = useMemo(() => {
    if (!userTitles?.length) return [];
    const { categories } = parseContractsCategories(userTitles);
    return Object.keys(categories);
  }, [userTitles]);

  const availableSubcategories = useMemo(() => {
    if (!userTitles?.length || !category.trim()) return [];
    const { categories } = parseContractsCategories(userTitles);
    return Object.keys(categories[category.trim()]?.subcategories || {});
  }, [userTitles, category]);

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
        <label htmlFor={catId}>Category (Optional)</label>
        <input
          id={catId}
          list={catListId}
          type="text"
          placeholder="e.g. Art, Music, Tech..."
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            if (!e.target.value) setSubcategory("");
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {availableCategories.length > 0 && (
          <datalist id={catListId}>
            {availableCategories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        )}
      </div>

      <div className="title-editor-field">
        <label htmlFor={subId}>Subcategory (Optional)</label>
        <input
          id={subId}
          list={subListId}
          type="text"
          placeholder={category.trim() ? "e.g. Paintings, 80s..." : "Enter a category first"}
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {availableSubcategories.length > 0 && (
          <datalist id={subListId}>
            {availableSubcategories.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        )}
      </div>

      <div className="title-editor-field">
        <label htmlFor={titleId}>Title</label>
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

        {/* DEV PREVIEW */}
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
