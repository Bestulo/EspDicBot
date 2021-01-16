import { searchEng } from "./dictools/searchEng.ts";
import { searchEpo } from "./dictools/searchEpo.ts";
import { ResultTuple } from "./types/ResultTuple.ts";

const engList: ResultTuple[] = JSON.parse(
  await Deno.readTextFile("espdicvaluesTupleized.json"),
);
const epoList: ResultTuple[] = JSON.parse(
  await Deno.readTextFile("espdickeysTupleized.json"),
);

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

// eneo("fuck").then(console.log);

export { eneo, eoen };
