export const randomEnumValue = (enumeration, offset = 0) => {
  const values = Object.keys(enumeration);
  const enumKey = values[Math.floor(Math.random() * (values.length - offset))];
  return enumeration[enumKey];
};