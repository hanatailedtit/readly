export const parseDomSizeValue = (value: string | number, unit = 'px') => {
  if (typeof value === 'string') return value;
  return `${value}${unit}`;
};

export const getFileInfo = (fullName: string) => {
  const point = fullName.lastIndexOf('.');
  const name = fullName.substring(0, point);
  const extension = fullName.substring(point + 1, fullName.length);
  return {
    name,
    extension,
  };
};
