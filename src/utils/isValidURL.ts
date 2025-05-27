export const isValidURL = (str: string) => {
  // Improved regex to account for query parameters and URL fragments
  const regex =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})(\/[\w.-]*)?(\?[\w=&.-]*)?(#[\w.-]*)?$/;
  return regex.test(str);
};
