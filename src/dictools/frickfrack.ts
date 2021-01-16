import { ResultTuple } from "../types/ResultTuple.ts";
import { searchEng } from "./searchEng.ts";
import { searchEpo } from "./searchEpo.ts";

const engList: ResultTuple[] = JSON.parse(
  await Deno.readTextFile("../../espdicvaluesTupleized.json"),
);
const epoList: ResultTuple[] = JSON.parse(
  await Deno.readTextFile("../../espdickeysTupleized.json"),
);

const formatTuple = (
  tuple: ResultTuple,
  lang1: string,
  lang2: string,
  targetList: ResultTuple[],
) => ({
  [lang1]: tuple[1],
  [lang2]: targetList[tuple[0]][1],
});

// const searchAndFormat = async (searchFn: Function, query: string, sourceList: ResultTuple[], targetList: ResultTuple[], sourceLang: string, targetLang: string) {

//   const resultTuples = await searchFn(query, sourceList)
//   const resultObjectArray = resultTuples.map((tuple: ResultTuple) => formatTuple(tuple, sourceLang, targetLang, targetList))
//   return resultObjectArray
// }

const eneo = (q: string) =>
  searchEng(q, engList).then((sourceTuples) =>
    sourceTuples.map((tuple) => ({
      en: tuple[1] as string,
      eo: epoList[tuple[0]][1] as string,
    }))
  );

const eoen = (q: string) =>
  searchEpo(q, epoList).then((sourceTuples) =>
    sourceTuples.map((tuple) => ({
      eo: tuple[1],
      en: engList[tuple[0]][1],
    }))
  );

console.log(await eoen("arbar"));
