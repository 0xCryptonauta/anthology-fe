import { MemoirInterface } from "@src/store/slices/anthologySlice";

export const ListMemoirSkin = ({ memoirs }: { memoirs: MemoirInterface[] }) => {
  return (
    <div style={{ marginTop: "30px" }}>
      {memoirs.map((memoir, index) => {
        return (
          <div key={index}>
            <span>
              {index} - {memoir.title}
            </span>
            <p>{memoir.content}</p>
          </div>
        );
      })}
    </div>
  );
};
