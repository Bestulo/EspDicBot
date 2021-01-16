const urlToChars = [
  ["%C4%89", "ĉ"],
  ["%C4%9D", "ĝ"],
  ["%C4%B5", "ĵ"],
  ["%C5%9D", "ŝ"],
  ["%C4%A5", "ĥ"],
  ["%C5%AD", "ŭ"],
  ["%C4%88", "Ĉ"],
  ["%C4%9C", "Ĝ"],
  ["%C4%B4", "Ĵ"],
  ["%C5%9C", "Ŝ"],
  ["%C4%A4", "Ĥ"],
  ["%C5%AC", "Ŭ"],
];

export const deurlifySpecialChars = (str: string) => {
  let finalStr = str;
  urlToChars.forEach((val) => {
    finalStr = str.includes(val[0])
      ? finalStr.replace(val[0], val[1])
      : finalStr;
  });
  return finalStr;
};
