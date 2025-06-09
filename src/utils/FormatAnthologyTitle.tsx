export const FormatAnthologyTitle = (title?: string): React.ReactNode => {
  if (!title) return "";

  // Only parse if the title starts with a bracket
  if (!title.trim().startsWith("[")) {
    return (
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          color: "white",
          display: "flex",
          alignItems: "center",
        }}
      >
        {title}
      </div>
    );
  }

  const match = title.match(/\[(.*?)\](?:\[(.*?)\])?\s*(.*)/);
  if (!match) {
    return (
      <div style={{ fontSize: "1.5rem", fontWeight: "600", color: "white" }}>
        {title}
      </div>
    );
  }

  const [, category, subcategory, item] = match;

  return (
    <div>
      <div style={{ fontSize: "1rem", color: "white" }}>
        {category}
        {subcategory && ` › ${subcategory}`}
      </div>
      <div
        style={{
          fontSize: item.length < 27 ? "1.3rem" : "1.1rem",
          fontWeight: "600",
          color: "white",
        }}
      >
        {item}
      </div>
    </div>
  );
};
