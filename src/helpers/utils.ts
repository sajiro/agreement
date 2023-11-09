export const json2QueryString = (obj: any) => {
  const str: string[] = [];
  Object.entries(obj).forEach(([key, value]) => {
    str.push(`${key}=${value}`);
  });
  return str.join("&");
};