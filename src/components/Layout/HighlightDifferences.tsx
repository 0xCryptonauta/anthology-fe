export const HighlightDifferences = (str1: string, str2: string) => {
  const result = [];
  let str2Index = 0;

  for (let i = 0; i < str1.length; i++) {
    if (str2Index < str2.length && str1[i] === str2[str2Index]) {
      result.push(str1[i]);
      str2Index++;
    } else {
      result.push(
        <span key={i} style={{ color: "red" }}>
          {str1[i]}
        </span>
      );
    }
  }

  return result;
};
