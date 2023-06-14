export const getTypeItem = (itemId: string) => {
  const idRegex = /(PM|MI)/g;

  const [prefix, _] = itemId.match(idRegex) ?? [];

  return prefix;
}
