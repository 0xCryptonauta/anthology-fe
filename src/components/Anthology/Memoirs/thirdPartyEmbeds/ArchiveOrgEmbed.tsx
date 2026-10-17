export const ArchiveOrgEmbed = ({ itemId }: { itemId: string }) => (
  <div style={{ width: "100%", aspectRatio: "16/9" }}>
    <iframe
      src={`https://archive.org/embed/${itemId}`}
      style={{ width: "100%", height: "100%", border: 0 }}
      allowFullScreen
      loading="lazy"
      title="Internet Archive item"
    />
  </div>
);
