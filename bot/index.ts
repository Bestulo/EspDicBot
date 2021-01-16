import {
  InlineKeyboardButton,
  InlineQueryResultArticle,
  InlineQueryUpdate,
  InputTextMessageContent,
  Message,
  TelegramBot,
  UpdateType,
} from "https://deno.land/x/telegram_bot_api/mod.ts";
import { search } from "../src/api/search.ts";
import { toSpecial } from "../src/api/xsistemo/xsistemo.js";
import { FullResult } from "../src/types/FullResult.ts";
import {
  generateKeyboard,
  KeyboardState,
  objectifyState,
} from "./keyboardGenerator.ts";
type InlineKeyboard = InlineKeyboardButton[][];

const TOKEN = JSON.parse(await Deno.readTextFile("./config/secrets.json"));
if (!TOKEN) throw new Error("Bot token is not provided");
const bot = new TelegramBot(TOKEN);

// Code initialization for proper command handling

interface Interactable extends Message {
  reply(text: string, opts: any): Promise<Message>;
}

bot.on(UpdateType.Error, console.error);

function onText(regex: RegExp, cb: Function) {
  bot.on(UpdateType.Message, ({ message }) => {
    if (message.text) {
      if (regex.test(message.text)) {
        (message as Interactable).reply = (text: string, opts: any) =>
          bot.sendMessage({
            chat_id: message.chat.id,
            text,
            ...opts,
          });
        cb(message, message.text.match(regex));
      }
    }
  });
}

type Command = { status: false } | {
  status: true;
  command: string;
  args: string[];
};

const _isCommand = (text: string): Command => {
  const commandPrefix = "^/";
  const commandMiddle = "[a-z_]+";
  const regex = new RegExp(commandPrefix + commandMiddle, "i");

  if (regex.test(text)) {
    const splatArgs = text.split(" ");
    const command = splatArgs[0].substr(1);
    const args = splatArgs.slice(1);

    return {
      status: true,
      command,
      args,
    };
  } else {
    return {
      status: false,
    };
  }
};

function replyToMsg(msg: Message, text: string) {
  return bot.sendMessage({
    chat_id: (Number(msg.chat.id)),
    text: text,
    reply_to_message_id: msg.message_id,
  });
}

const sendMessage = (chat_id: number | string, text: string, opts?: any) =>
  bot.sendMessage({ text, chat_id, ...opts });

const editMessageText = (msg: Message, text: string, opts: any) =>
  bot.editMessageText({ chat_id: msg.chat.id, text, ...opts }).catch(
    console.error,
  );

const botApi = (method: string, params: Object) => {
  //console.log(params);

  return fetch("https://api.telegram.org/bot" + TOKEN.token + "/" + method, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }); //.then((res) => res.text()).then(console.log);
};
const editResults = (
  msg: Message | string,
  text: string,
  keyboard: InlineKeyboard,
) =>
  botApi("editMessageText", {
    chat_id: typeof msg !== "string" ? msg.chat.id : undefined,
    [typeof msg === "string" ? "inline_message_id" : "message_id"]:
      typeof msg === "string" ? msg : msg.message_id,
    parse_mode: "HTML",
    text,
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });

function sendResult(msg: Message, opts: any) {
  return botApi("sendMessage", {
    chat_id: msg.chat.id,
    text: opts.text,
    reply_markup: { inline_keyboard: opts.keyboard },
    parse_mode: "HTML",
    reply_to_message_id: msg.message_id,
  });
  // sendMessage(msg.chat.id, opts.text, {
  //   parse_mode: "HTML",
  //   inline_keyboard: opts.keyboard,
  //   reply_to_message_id: msg.message_id,
  // });
}

onText(
  /^\/(?:helpo|helpu|helpi)(?:@EspDicBot|@ElMejorRobot)?$/,
  (msg: Message) => {
    sendHelp(msg, "eo");
  },
);

onText(
  /^\/(?:help|start)(?:@EspDicBot|@ElMejorRobot)?$/,
  (msg: Message) => {
    sendHelp(msg, "en");
  },
);

function sendHelp(msg: Message, lang: string, edit?: true) {
  let text, opts, keyboard;
  if (lang === "eo") {
    text = `Saluton! Mi estas *EspDicBot*. Vi povas serĉi tra mi en la *EspDic*.

Por serĉi de la angla al Esperanto, uzu la komandon \`\/eneo\` + \`vorto\`. Ekzemple:
\/eneo hatchet

Por serĉi de Esperanto al la angla, uzu la komandon \`\/eoen\` + \`vorto\`. Ekzemple:
\/eoen hundaĉo

Se vi trovas eraron (bug ktp) aŭ plibonigeblaĵon, bonvolu kontakti @Bestulo.`;
    keyboard = {
      inline_keyboard: [
        [{ text: "Read in English", callback_data: "help to english" }],
      ],
    };
  } /*if (lang === "en") */ else {
    text =
      `Hello! I am *EspDicBot*. With me, you can search the Esperanto-English dictionary *EspDic*.

To search from English to Esperanto, use the command \`\/eneo\` + \`word\`. For example:
\/eneo juggle

To search from Esperanto to English, use the command \`\/eoen\` + \`word\`. For example:
\/eoen pioĉo

If you find any bug, error or have any feedback or suggestion, please contact @Bestulo.`;
    keyboard = {
      inline_keyboard: [
        [{ text: "Legi en Esperanto", callback_data: "help to esperanto" }],
      ],
    };
  }
  if (edit) {
    return editMessageText(msg, text, {
      message_id: msg.message_id,
      parse_mode: "markdown",
      reply_markup: keyboard,
    });
  } else {
    return sendMessage(msg.chat.id, text, {
      parse_mode: "markdown",
      reply_markup: keyboard,
    });
  }
}

const stringifyResults = (results: FullResult[]) =>
  results.map((r) => `<strong>${r.eo}:</strong> ${r.en}`).join("\n");

function formatResults(
  query: string,
  language: "a" | "e",
  results: FullResult[],
) {
  const startText = language === "e"
    ? `🔽 Jen <strong>${results.length}<\/strong> rezultoj por via serĉo pri <strong>${query}<\/strong> 🔽\n\n`
    : `🔽 Here are <strong>${results.length}<\/strong> results for your search <strong>${query}<\/strong> 🔽\n\n`;
  return startText + stringifyResults(results);
}

onText(
  /^\/(?:eoen|epoeng|eo)(?:@EspDicBot|@ElMejorRobot)? (.+)/,
  async (msg: Message, match: RegExpMatchArray) => {
    const _query = toSpecial(match[1]);
    const query = (_query.match(/([a-zA-ZĉŝĵĥĝŭĈŜĴĤĜŬ]+)/) || [])[1];
    if (query) {
      const res = await search(query, "en", 0, 5);
      // console.log(query);
      const state: KeyboardState = {
        availableResults: res.availableResults,
        displayAmount: 5,
        displayLanguage: "e",
        query,
        sourceLanguage: "e",
        startIndex: 0,
      };
      return sendResult(msg, {
        keyboard: generateKeyboard(state),
        text: formatResults(query, "e", res.results),
      });
    } else {
      replyToMsg(msg, "Serĉo ne valida");
    }
  },
);

onText(
  /^\/(?:eneo|engepo|en)(?:@EspDicBot|@ElMejorRobot)? (.+)/,
  async (msg: Message, match: RegExpMatchArray) => {
    const query = match[1];
    // const query = (_query.match(/([a-zA-ZĉŝĵĥĝŭĈŜĴĤĜŬ]+)/) || [])[1];
    if (query) {
      console.log(
        `chat[${msg.chat.title || "private message"}${
          msg.chat.title ? " " + msg.chat.id : ""
        }] user[${msg
          .from?.first_name} ${msg.from?.id}] query[${query}]`,
      );
      const res = await search(query, "eo", 0, 5);
      // console.log(query);
      const state: KeyboardState = {
        availableResults: res.availableResults,
        displayAmount: 5,
        displayLanguage: "a",
        query,
        sourceLanguage: "a",
        startIndex: 0,
      };
      return sendResult(msg, {
        keyboard: generateKeyboard(state),
        text: formatResults(query, "a", res.results),
      });
    } else {
      replyToMsg(msg, "Serĉo ne valida");
    }
  },
);

bot.on(UpdateType.CallbackQuery, async (msg) => {
  // console.log(msg);
  if (msg.callback_query?.data && msg.callback_query) {
    if (
      msg.callback_query?.data === "help to esperanto" &&
      msg.callback_query.message
    ) {
      sendHelp(msg.callback_query.message, "eo", true);
      return;
    }
    if (
      msg.callback_query?.data === "help to english" &&
      msg.callback_query.message
    ) {
      sendHelp(msg.callback_query.message, "en", true);
      return;
    }
    const state = objectifyState(msg.callback_query.data);
    // console.log(state);
    if (state) {
      try {
        const res = await search(
          state.query,
          state.sourceLanguage === "e" ? "en" : "eo",
          state.startIndex,
          state.displayAmount + state.startIndex,
        );
        const text = formatResults(
          state.query,
          state.displayLanguage,
          res.results,
        );
        if (msg.callback_query.message) {
          editResults(
            msg.callback_query.message,
            text,
            generateKeyboard(state),
          )
            .catch(console.error);
        } else if (msg.callback_query.inline_message_id) {
          editResults(
            msg.callback_query.inline_message_id,
            text,
            generateKeyboard(state),
          );
        }
        // console.log(msg);
      } catch (e) {
        console.error(e);
      }
    } else {
      sendMessage(
        237799109,
        "Invalid `callback_query` data: `" + msg.callback_query.data + "`",
        { parse_mode: "markdown" },
      );
    }
  }
});

const emptyAnswer = (msg: InlineQueryUpdate) => {
  bot.answerInlineQuery({
    inline_query_id: msg.inline_query.id,
    results: [{
      type: "article",
      id: "emptyresult0",
      title: "Tajpu vorton - Type a word",
      input_message_content: {
        message_text: "Tajpu vorton tiel:\n@EspDicBot arbo",
      },
      description: "Tajpu vorton tiel:\n@EspDicBot arbo",
    }],
    cache_time: 251,
    next_offset: "",
  }).catch(console.error);
};

bot.on(UpdateType.InlineQuery, async (msg) => {
  const inline_query_id = msg.inline_query.id;
  if (msg.inline_query.query === "") {
    emptyAnswer(msg);
    return;
  }
  const raw_query = msg.inline_query.query;
  const english_query = (raw_query.match(/([a-z]+)/i) || [])[1];
  const esperanto_query: string | undefined =
    (raw_query.match(/([a-zA-ZĉŝĵĥĝŭĈŜĴĤĜŬ]+)/) || [])[1];
  const english_res = english_query
    ? await search(raw_query, "eo", 0, 5)
    : undefined;
  const eneoImage = "https://i.ibb.co/YNj31yP/Slice-7.jpg";
  const eoenImage = "https://i.ibb.co/fSXBQ8N/Slice-6.jpg";
  const inlineQueryResults: InlineQueryResultArticle[] = [];
  if (english_query && english_res) {
    // console.log(
    //   `[en-inline] user[${msg.inline_query.from.first_name} ${msg.inline_query.from.id}] query[${english_query}]`,
    // );
    const content: InputTextMessageContent = {
      message_text: formatResults(raw_query, "e", english_res.results),
      parse_mode: "HTML",
    };

    const state: KeyboardState = {
      availableResults: english_res.availableResults,
      displayAmount: 5,
      displayLanguage: "e",
      query: raw_query,
      sourceLanguage: "a",
      startIndex: 0,
    };

    const article: InlineQueryResultArticle = {
      type: "article",
      id: raw_query + "0",
      title: "Angla→Esperanto: " + raw_query,
      description: english_res.availableResults + " rezultoj",
      input_message_content: content,
      thumb_url: eneoImage,
      reply_markup: { inline_keyboard: generateKeyboard(state) },
    };
    inlineQueryResults.push(article);
  } else emptyAnswer(msg);
  if (esperanto_query) {
    // console.log(
    //   `[eo-inline] user[${msg.inline_query.from.first_name} ${msg.inline_query.from.id}] query[${esperanto_query}]`,
    // );
    const esperanto_res = await search(esperanto_query, "en", 0, 5);
    if (
      typeof esperanto_res.availableResults === "number" &&
      esperanto_res.availableResults > 0
    ) {
      const content: InputTextMessageContent = {
        message_text: formatResults(raw_query, "a", esperanto_res.results),
        parse_mode: "HTML",
      };

      const state: KeyboardState = {
        availableResults: esperanto_res.availableResults,
        displayAmount: 5,
        displayLanguage: "e",
        query: esperanto_query,
        sourceLanguage: "e",
        startIndex: 0,
      };

      const article: InlineQueryResultArticle = {
        type: "article",
        id: raw_query + "1",
        title: "Esperanto→Angla: " + raw_query,
        description: esperanto_res.availableResults + " rezultoj",
        input_message_content: content,
        thumb_url: eoenImage,
        reply_markup: { inline_keyboard: generateKeyboard(state) },
      };
      inlineQueryResults.push(article);
    } else emptyAnswer(msg);
  } else emptyAnswer(msg);
  // console.log("rez" + raw_query);
  if (inlineQueryResults.length > 0) {
    console.log(
      `[inline] user[${msg.inline_query.from.first_name} ${msg.inline_query.from.id}] query[${raw_query}]`,
    );
  }
  bot.answerInlineQuery({
    inline_query_id,
    results: inlineQueryResults,
    cache_time: 251,
    next_offset: "",
  }).catch(console.error);
});

bot.getMe().then((me) => {
  console.log("Started bot " + me.username);
  bot.run({ polling: true });
});

export {};

// search(
//   query,
//   sourceLanguage === "a" ? "en" : "eo",
//   startIndex,
//   endIndexNotIncluded)
