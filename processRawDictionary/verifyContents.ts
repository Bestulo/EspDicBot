const wordlist1 = await Deno.readTextFile("./espdickeys.json")
  .then(JSON.parse)
  .then((x) => x.map((r: string) => r.toLowerCase()));
const wordlist2 = await Deno.readTextFile("./espdickeys2.json")
  .then(JSON.parse)
  .then((x) => x.map((r: string) => r.toLowerCase()));

console.log(wordlist1.filter((w1: string) => !wordlist2.includes(w1)));

export {};
