module.exports = {
  apps: [
    {
      name: "espdicbot",
      script: "./bot/index.ts",
      interpreter: "deno",
      interpreterArgs: "run --allow-net --allow-read --allow-write",
    },
  ],
};
