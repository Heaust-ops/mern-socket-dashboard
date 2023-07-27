export const formatDataH = (arg: number | string) => {
  if (+arg < 1024) return `${arg} MB`;
  return `${(+arg / 1024).toFixed(2)} GB`;
};
