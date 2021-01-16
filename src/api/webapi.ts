import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { ApiResult } from "../types/ApiResult.ts";
import { search } from "./search.ts";

const router = new Router();
router
  .get(
    "/:sourceLanguage/:targetLanguage/:rawQuery/:startIndexString/:endIndexNotIncludedString",
    async (ctx) => {
      const {
        sourceLanguage,
        targetLanguage,
        rawQuery,
        startIndexString,
        endIndexNotIncludedString,
      } = ctx.params;

      const query = rawQuery ? decodeURIComponent(rawQuery) : undefined;
      const startIndex = Number(startIndexString);
      const endIndexNotIncluded = Number(endIndexNotIncludedString);

      const languagesOkay =
        (sourceLanguage === "en" && targetLanguage === "eo") ||
        (sourceLanguage === "eo" && targetLanguage === "en");
      const queryOkay = query && /^[a-zA-ZĉĝĵŝĥŭĈĜĴŜĤŬ\s,-]{1,40}$/.test(query);
      const startIndexOkay = startIndex >= 0 &&
        startIndex <= endIndexNotIncluded;
      const endIndexOkay = endIndexNotIncluded > startIndex &&
        endIndexNotIncluded < 70000;

      if (!languagesOkay) {
        ctx.response.status = 400;
        ctx.response.body = {
          ok: false,
          error:
            "The only language combinations supported by this API are `en->eo` and `eo->en`",
        };
      } else if (!queryOkay) {
        ctx.response.status = 400;
        ctx.response.body = {
          ok: false,
          error:
            "The only valid characters are those in the English and Esperanto alphabets, commas and dashes. Maximum query length is 40 characters",
        };
      } else if (!startIndexOkay) {
        ctx.response.status = 400;
        ctx.response.body = {
          ok: false,
          error:
            "startIndex must be: (a) 0 or higher and (b) lower than endIndexNotIncluded",
        };
      } else if (!endIndexOkay) {
        ctx.response.status = 400;
        ctx.response.body = {
          ok: false,
          error:
            "endIndexNotIncluded must be: (a) higher than startIndex and (b) lower than 70000",
        };
      } else {
        const results = await search(
          query as string,
          targetLanguage as "en" | "eo",
          startIndex,
          endIndexNotIncluded,
        );

        const response: ApiResult = {
          ok: true,
          sourceLanguage: sourceLanguage as string,
          targetLanguage: targetLanguage as string,
          query: query as string,
          availableResults: results.availableResults,
          displayedResults: results.results.length,
          results: results.results,
        };
        ctx.response.body = response;
      }
    },
  );
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 35470 });

export {};
