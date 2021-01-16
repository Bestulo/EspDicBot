# espdicbot

Requirements:
- Deno

For development, run it like so:
- `deno run --allow-read --allow-write --allow-net bot/index.ts`

For production, the preferred method, I use Nodejs with Deno:
- `yarn global add pm2`
- `pm2 start`

pm2 reads the `ecosystem.config.js`.

Make sure that your PM2 restarts at system reboot:
- `pm2 startup`

Then follow PM2's instructions, which depend on which OS and distro you're running.

## Add your own bot token

Create a file called `secrets.json` in the `config` folder. It must have your token in this manner:

```json
{"token": "123456789:ABCDEFghIJk-lM-NLpqewrASdga2u8" }
```
  
  This file is an object that has the `token` property. Follow the `secrets-example.json` pattern.