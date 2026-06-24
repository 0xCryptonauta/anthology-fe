import { useAppSelector } from "@store/utils/hooks";

export const Footer = () => {
  const footerBgClass = useAppSelector((s) => s.dapp.anthologyFooterBgClass);

  return (
    <div
      className={footerBgClass}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#222222",
        height: "60px",
      }}
    >
      <span>© 2026 - InBytes.xyz</span>
      
      <span style={{ fontSize: "0.7rem" }}>
        Recording the collective memory.
      </span>
    </div>
  );
};
