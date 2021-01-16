const specialList = ["ĉ", "ĝ", "ĥ", "ĵ", "ŝ", "ŭ"];
const xList = ["Cx", "Gx", "Hx", "Jx", "Sx", "Ux"];
// const hList = ["Ch", "Gh", "Hh", "Jh", "Sh"];

interface Sistemo {
  special: string;
  x: string;
  h?: string;
}

const sistemoj: Sistemo[] = [
  { special: "Ĉ", x: "Cx", h: "Ch" },
  { special: "ĉ", x: "cx", h: "ch" },
  { special: "Ĝ", x: "Gx", h: "Gh" },
  { special: "ĝ", x: "gx", h: "gh" },
  { special: "Ĥ", x: "Hx", h: "Hh" },
  { special: "ĥ", x: "hx", h: "hh" },
  { special: "Ĵ", x: "Jx", h: "Jh" },
  { special: "ĵ", x: "jx", h: "jh" },
  { special: "Ŝ", x: "Sx", h: "Sh" },
  { special: "ŝ", x: "sx", h: "sh" },
  { special: "Ŭ", x: "Ux" },
  { special: "ŭ", x: "ux" },
];

export const toX = (str: string) =>
  str.split("").map((letter) => {
    const finalLetter = specialList.includes(letter.toLowerCase())
      ? xList[specialList.indexOf(letter.toLowerCase())]
      : letter;
    if (!(letter.toUpperCase() === letter)) return finalLetter.toLowerCase();
    else return finalLetter;
  }).join("");

export const toSpecial = (str: string) => {
  let skip = false;
  return str
    .split("")
    .map((letter, index, charArr) => {
      if (skip) {
        skip = false;
        return "";
      }
      if (index === charArr.length - 1) { // if last letter, no point analyzing
        return letter;
      }
      if (index < charArr.length - 2 && charArr[index + 2] === "x") {
        return letter;
      }
      const pair = letter + charArr[index + 1].toLowerCase();
      const sistemo = sistemoj.find((s) => pair === s.x || pair === s.h);
      if (!sistemo) {
        return letter;
      }
      skip = true;
      return sistemo.special;
    })
    .join("");
};

// export { fromH, fromX, toX };
