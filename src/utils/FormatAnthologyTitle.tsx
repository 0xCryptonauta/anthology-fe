export const FormatAnthologyTitle = (title?: string): React.ReactNode => {
  if (!title) return "";

  const match = title.match(/\[(.*?)\](?:\[(.*?)\])?\s*(.*)/);
  if (!match) return title;

  const [, category, subcategory, item] = match;

  return (
    <div style={{ lineHeight: 1.3 }}>
      <div
        style={{
          fontSize: "1rem",
          color: "white",
          /* display: "flex",
          justifyContent: "center", */
        }}
      >
        {category}
        {subcategory && ` › ${subcategory}`}
      </div>
      <div
        style={{
          fontSize: item.length < 27 ? "1.5rem" : "1.2rem", //magic number :V
          fontWeight: "600",
          color: "white",
        }}
      >
        {item}
      </div>
    </div>
  );
};
