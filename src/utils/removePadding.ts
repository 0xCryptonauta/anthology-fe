const LEFT_PADDING_REGEX = /^[\0]+/g;

export const removePadding = (contractValue: string) => {
  const trimmedSkin = contractValue.replace(LEFT_PADDING_REGEX, "");
  return trimmedSkin;
};
