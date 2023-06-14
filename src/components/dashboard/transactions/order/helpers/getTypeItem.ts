export const getTypeItem = (itemId: string) => {
  const idRegex = /(PM|MI)/g;

  const prefix = itemId.match(idRegex) ?? [];

  return prefix[0];
}
