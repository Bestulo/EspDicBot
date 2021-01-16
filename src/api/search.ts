import { searchEng } from "../dictools/searchEng.ts";
import { searchEpo } from "../dictools/searchEpo.ts";
import { FullResult } from "../types/FullResult.ts";
import { ResultTuple } from "../types/ResultTuple.ts";
import { getWordCache, setWordCache } from "./cache.ts";

const engList: ResultTuple[] = JSON.parse(
  await Deno.readTextFile("espdicvaluesTupleized.json"),
);
const epoList: ResultTuple[] = JSON.parse(
  await Deno.readTextFile("espdickeysTupleized.json"),
);

const eneo = (q: string): Promise<FullResult[]> =>
  searchEng(q, engList).then((sourceTuples) =>
    sourceTuples.map((tuple) => ({
      index: tuple[0],
      en: tuple[1] as string,
      eo: epoList[tuple[0]][1] as string,
    }))
  );

const eoen = (q: string): Promise<FullResult[]> =>
  searchEpo(q, epoList).then((sourceTuples) =>
    sourceTuples.map((tuple) => ({
      index: tuple[0],
      eo: tuple[1],
      en: engList[tuple[0]][1],
    }))
  );

const fullResultFromCache = async (cache: number[]) =>
  cache.map((index) => ({
    index,
    eo: epoList[index][1],
    en: engList[index][1],
  }));

async function search(
  query: string,
  targetLanguage: "en" | "eo",
  startIndex: number,
  endIndexNotIncluded: number,
) {
  const sourceLanguage = targetLanguage === "en" ? "eo" : "en";
  const searchFn = targetLanguage === "en" ? eoen : eneo;
  const cache = await getWordCache(query, sourceLanguage);
  if (cache.ok === false) {
    const result = await searchFn(query);
    const availableResults = result.length;
    // Last index is included because this has to interact with a user interface.
    setWordCache(query, sourceLanguage, result.map((r) => r.index));
    return {
      availableResults,
      results: result.slice(startIndex, endIndexNotIncluded) as FullResult[],
    };
  } else {
    const result = await fullResultFromCache(cache.cache);
    const availableResults = result.length;
    return {
      availableResults,
      results: result.slice(startIndex, endIndexNotIncluded) as FullResult[],
    };
  }
}

export { searchEng } from "../dictools/searchEng.ts";
export { searchEpo } from "../dictools/searchEpo.ts";
export { engList, epoList, search };

// const stringifyResults = (r: FullResult[]) =>
//   r.map((r) => `${r.eo}: ${r.en}`).join("\n");

// const start = 50;
// const end = 120;

// search("arbo", "en", start, end).then((arr) =>
//   console.log(
//     `Showing results ${start + 1} to ${end}. Result amount: ${arr.length}

// ${stringifyResults(arr)}`,
//   )
// );
