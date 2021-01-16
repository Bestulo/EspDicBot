import { ResultTuple } from "../types/ResultTuple.ts";

function tuple(i: number, el: string): ResultTuple {
  return [i, el];
}

const removeLast = (w: string) => w.substring(0, w.length - 1);
const removeFirst = (w: string) => w.substring(1, w.length);

const removeSurroundingDashes = (w: string) => {
  if (w.startsWith("-")) w = removeFirst(w);
  if (w.endsWith("-")) w = removeLast(w);
  return w;
};

const sameFirstLastOrNone = (query: string, result: string) =>
  query === result && 0 ||
  result.startsWith(query) && 1 ||
  result.endsWith(query) && 2 ||
  3;

const sortResults = (query: string, results: ResultTuple[]) =>
  results.sort((a, b) =>
    sameFirstLastOrNone(query, a[1]) - sameFirstLastOrNone(query, b[1])
  );

const isolatedLastFirstOrNone = (query: string, result: string) =>
  /*query === result && 0
  || */ (new RegExp(`(?:, |^)${query}(?:,|$)`, "i")).test(result) && 1 ||
    (new RegExp(` ${query}$`, "i")).test(result) && 2 ||
    (new RegExp(`^${query} `, "i")).test(result) && 3 ||
    (new RegExp(` ${query} `, "i")).test(result) && 4 ||
    5;

const sortResultsEng = (query: string, results: ResultTuple[]) =>
  results.sort((a, b) =>
    isolatedLastFirstOrNone(query, a[1]) - isolatedLastFirstOrNone(query, b[1])
  );

const arrIntoIndexedTuples = (arr: string[]): ResultTuple[] =>
  arr.map((el, i) => tuple(i, el));

export {
  arrIntoIndexedTuples,
  removeSurroundingDashes,
  sortResults,
  sortResultsEng,
};
