import { assertStrictEquals } from "https://deno.land/std@0.83.0/testing/asserts.ts";
import { toSpecial, toX } from "./xsistemo.ts";

// Deno.test("From X-sistemo", () => {
//   assertStrictEquals(fromX("cx"), "ĉ");
//   assertStrictEquals(fromX("acheti"), "acheti");
//   assertStrictEquals(fromX("acxetxi"), "aĉetxi");
//   assertStrictEquals(fromX("aĉxa"), "aĉxa");
//   assertStrictEquals(fromX("acXa"), "aĉa");
//   assertStrictEquals(fromX("aCxa"), "aĈa");
//   assertStrictEquals(fromX("hodiaŭ"), "hodiaŭ");
//   assertStrictEquals(fromX("Cxamau-CXAmaux-uh"), "Ĉamau-ĈAmaŭ-uh");
//   assertStrictEquals(fromX("cx"), "ĉ");
//   assertStrictEquals(fromX("ajxaGHaSXiux"), "aĵaGHaŜiŭ");
//   assertStrictEquals(fromX("Jxajhhoruso"), "Ĵajhhoruso");
// });

// Deno.test("From H-sistemo", () => {
//   assertStrictEquals(fromH("ch"), "ĉ");
//   assertStrictEquals(fromH("aczeti"), "aczeti");
//   assertStrictEquals(fromH("achethi"), "aĉethi");
//   assertStrictEquals(fromH("aĉha"), "aĉha");
//   assertStrictEquals(fromH("acHa"), "aĉa");
//   assertStrictEquals(fromH("aCha"), "aĈa");
//   assertStrictEquals(fromH("zodiaŭ"), "zodiaŭ");
//   assertStrictEquals(fromH("Chamau-CXAmauh-uz"), "Ĉamau-CXAmauh-uz");
//   assertStrictEquals(fromH("ch"), "ĉ");
//   assertStrictEquals(fromH("ajhaGHaSXiuh"), "aĵaĜaSXiuh");
//   assertStrictEquals(fromH("Jhajxhxorushogx"), "Ĵajxhxoruŝogx");
// });

// Deno.test("From mixed systems", () => {
//   assertStrictEquals(fromH(fromX("ch")), "ĉ");
//   assertStrictEquals(fromH(fromX("acxeti")), "aĉeti");
//   assertStrictEquals(fromH(fromX("acheuxi")), "aĉeŭi");
//   assertStrictEquals(fromH(fromX("machxoruso")), "macĥoruso");
//   assertStrictEquals(fromH(fromX("macxhoruso")), "maĉhoruso");
//   assertStrictEquals(fromH(fromX("acHa")), "aĉa");
//   assertStrictEquals(fromH(fromX("aCha")), "aĈa");
//   assertStrictEquals(fromH(fromX("GHodiaux")), "Ĝodiaŭ");
//   assertStrictEquals(fromH(fromX("Chamau-CXAmauh-ux")), "Ĉamau-ĈAmauh-ŭ");
//   assertStrictEquals(fromH(fromX("ch")), "ĉ");
//   assertStrictEquals(fromH(fromX("ajhaGHaSXiuh")), "aĵaĜaŜiuh");
//   assertStrictEquals(fromH(fromX("Jhajxhxorushogx")), "Ĵaĵĥoruŝoĝ");
// });

Deno.test("From mixed systems", () => {
  assertStrictEquals(toSpecial("ch"), "ĉ");
  assertStrictEquals(toSpecial("acxeti"), "aĉeti");
  assertStrictEquals(toSpecial("acheuxi"), "aĉeŭi");
  assertStrictEquals(toSpecial("machxoruso"), "macĥoruso");
  assertStrictEquals(toSpecial("macxhoruso"), "maĉhoruso");
  assertStrictEquals(toSpecial("acHa"), "aĉa");
  assertStrictEquals(toSpecial("aCha"), "aĈa");
  assertStrictEquals(toSpecial("GHodiaux"), "Ĝodiaŭ");
  assertStrictEquals(toSpecial("Chamau-CXAmauh-ux"), "Ĉamau-ĈAmauh-ŭ");
  assertStrictEquals(toSpecial("ch"), "ĉ");
  assertStrictEquals(toSpecial("ajhaGHaSXiuh"), "aĵaĜaŜiuh");
  assertStrictEquals(toSpecial("Jhajxhxorushogx"), "Ĵaĵĥoruŝoĝ");
});

Deno.test("To X-sistemo", () => {
  assertStrictEquals(toX("ĉ"), "cx");
  assertStrictEquals(toX("acheti"), "acheti");
  assertStrictEquals(toX("aĉetxi"), "acxetxi");
  assertStrictEquals(toX("aĉxa"), "acxxa");
  assertStrictEquals(toX("aĉa"), "acxa");
  assertStrictEquals(toX("aĈa"), "aCxa");
  assertStrictEquals(toX("hodiaŭ"), "hodiaux");
  assertStrictEquals(toX("Ĉamau-ĈAmaŭ-uh"), "Cxamau-CxAmaux-uh");
  assertStrictEquals(toX("ĉ"), "cx");
  assertStrictEquals(toX("aĵaGHaŜiŭ"), "ajxaGHaSxiux");
  assertStrictEquals(toX("Ĵajhhoruso"), "Jxajhhoruso");
});
