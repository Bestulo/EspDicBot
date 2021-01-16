import { ensureDir } from "https://deno.land/std@0.81.0/fs/ensure_dir.ts";
import { exists } from "https://deno.land/std@0.81.0/fs/exists.ts";

await ensureDir("cache/en");
await ensureDir("cache/eo");

const readJson = async (path: string): Promise<number[]> =>
  JSON.parse(await Deno.readTextFile(path));

const writeJson = (path: string, data: number[]) =>
  Deno.writeTextFile(path, JSON.stringify(data));

const getWordCache = async (word: string, lang: string) => {
  const path = `cache/${lang}/${word}`;
  if (await exists(path)) {
    return { ok: true, cache: await readJson(path) };
  } else return { ok: false, cache: [] };
};

const setWordCache = (word: string, lang: string, cache: number[]) =>
  writeJson(`cache/${lang}/${word}`, cache);

export { getWordCache, setWordCache };
