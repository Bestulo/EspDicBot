import { ResultTuple } from "../types/ResultTuple.ts";
import { removeSurroundingDashes, sortResults } from "./utils.ts";

const withoutO = (query: string) =>
  /o$/i.test(query) ? query.substring(0, query.length - 1) : query;

async function searchEpo(query: string, wordList: ResultTuple[]) {
  const queryWithoutO = withoutO(query);
  const results = wordList.filter((w) =>
    w[1].includes(queryWithoutO) ||
    query.includes(
      w[1].length > 2
        ? withoutO(removeSurroundingDashes(w[1]))
        : removeSurroundingDashes(w[1]),
    )
  );
  return sortResults(query, results);
}

export { searchEpo };
