import { ResultTuple } from "../types/ResultTuple.ts";
import { sortResultsEng } from "./utils.ts";

async function searchEng(query: string, definitionList: ResultTuple[]) {
  const results = definitionList.filter((result) =>
    result[1] && result[1].includes(query)
  );
  return sortResultsEng(query, results);
}

export { searchEng };
