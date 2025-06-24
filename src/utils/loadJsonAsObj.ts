const maxSizeMB = 2;

export const loadJsonAsObj = <T extends object>(): Promise<T> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.style.display = "none";

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        reject(new Error("No file selected"));
        return;
      }

      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        reject(new Error(`File exceeds ${maxSizeMB}MB limit.`));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string) as T;
          resolve(parsed);
        } catch {
          reject(new Error("Invalid JSON format"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));

      reader.readAsText(file);
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
};
