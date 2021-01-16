import { FullResult } from "./FullResult.ts";

export type ApiResult = { ok: false } | {
  ok: true;
  sourceLanguage: string;
  targetLanguage: string;
  query: string;
  availableResults: number;
  displayedResults: number;
  results: FullResult[];
};
