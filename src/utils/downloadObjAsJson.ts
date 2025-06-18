export const downloadObjAsJson = <T extends object>(
  sliceData: T,
  filename: string = "slice.json"
): void => {
  if (!filename.toLowerCase().endsWith(".json")) {
    filename += ".json";
  }
  const jsonStr = JSON.stringify(sliceData, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
};
