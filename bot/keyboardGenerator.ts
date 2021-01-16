import { InlineKeyboardButton } from "https://deno.land/x/telegram_bot_api/mod.ts";

type InlineKeyboard = InlineKeyboardButton[][];

export type KeyboardState = {
  startIndex: number;
  sourceLanguage: "a" | "e";
  displayAmount: number;
  displayLanguage: "a" | "e";
  availableResults: number;
  query: string;
};

const previousPageStartIndex = (blockSize: number, startIndex: number) =>
  Math.max(startIndex - blockSize, 0);

const nextPageStartIndex = (blockSize: number, startIndex: number) =>
  startIndex + blockSize;

const newKeyboardState = <Key extends keyof KeyboardState>(
  state: KeyboardState,
  propName: Key,
  newState: KeyboardState[Key],
): KeyboardState => Object.assign({ ...state, [propName]: newState });

const stringifyState = (state: KeyboardState) =>
  state.startIndex +
  state.sourceLanguage +
  state.displayAmount +
  state.displayLanguage +
  state.availableResults +
  state.query;

export const objectifyState = (stateString: string): KeyboardState | null => {
  const reg = /^([0-9]+)([ae])([0-9]+)([ae])([0-9]+)([a-zA-ZĉŝĵĥĝŭĈŜĴĤĜŬ]+)/i;
  const match = stateString.match(reg);
  if (match) {
    const data = {
      startIndex: Number(match[1]),
      sourceLanguage: match[2],
      displayAmount: Number(match[3]),
      displayLanguage: match[4],
      availableResults: Number(match[5]),
      query: match[6],
    };
    return data as KeyboardState;
  } else return null;
};

const getNewStateString = <Key extends keyof KeyboardState>(
  state: KeyboardState,
  propName: Key,
  newState: KeyboardState[Key],
): string => stringifyState(newKeyboardState(state, propName, newState));

export function generateKeyboard(state: KeyboardState): InlineKeyboard {
  const previousPageButton = {
    text: state.displayLanguage === "a" ? "Previous page" : "Antaŭa paĝo",
    callback_data: getNewStateString(
      state,
      "startIndex",
      previousPageStartIndex(state.displayAmount, state.startIndex),
    ),
  };
  const nextPageButton = {
    text: state.displayLanguage === "a" ? "Next page" : "Sekva paĝo",
    callback_data: getNewStateString(
      state,
      "startIndex",
      nextPageStartIndex(state.displayAmount, state.startIndex),
    ),
  };
  const toOppositeLanguageButton = {
    text: state.displayLanguage === "a" ? "en esperanto" : "in English",
    callback_data: getNewStateString(
      state,
      "displayLanguage",
      state.displayLanguage === "a" ? "e" : "a",
    ),
  };

  const displayedAmountButtons = [5, 10, 15, 20, 30].filter((n) =>
    !(state.availableResults < n || state.displayAmount === n)
  ).map((n) => ({
    text: String(n),
    callback_data: getNewStateString(state, "displayAmount", n),
  }));

  const hasPreviousPage = state.startIndex > 0;
  const hasNextPage =
    state.availableResults > state.startIndex + state.displayAmount + 1;

  return [
    displayedAmountButtons,
    [
      ...(hasPreviousPage ? [previousPageButton] : []),
      toOppositeLanguageButton,
      ...(hasNextPage ? [nextPageButton] : []),
    ],
  ] as InlineKeyboard;
}

// export type KeyboardStates = {
//   startIndex: number;
//   sourceLanguage: "a" | "e";
//   displayAmount: number;
//   displayLanguage: "a" | "e";
//   availableResults: number;
//   query: string;
// };

// const myState = objectifyState("15e20a327aŭto");

// console.log(myState && generateKeyboard(myState));
