export const isValidURL = (str: string) => {
  const regex =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w _-]*(?:[/\w _-]*\?[^\s]*)?)?\/?$/;
  return regex.test(str);
};
