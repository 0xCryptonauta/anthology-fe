export const isValidURL = (str: string) => {
  const regex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})(\/[\w.-]*)*\/?$/;
  return regex.test(str);
};
