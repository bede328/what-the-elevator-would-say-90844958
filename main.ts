// What the Elevator Would Say — make.fun entry (program/v1).
// Writes the single funniest line a talking elevator could say to
// /output/entry.txt: one line, UTF-8, 1-120 characters, no trailing newline.
// Node 22, no dependencies. Run: node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "Weight limit exceeded. One of you has to walk. I will not say who. It is Dave.";

const OUT_PATH = "/output/entry.txt";

function codePoints(text: string): number {
  return [...text].length;
}

function main(): void {
  // Gate: exactly one line, 1-120 characters, no surrounding whitespace.
  if (codePoints(LINE) < 1 || codePoints(LINE) > 120) {
    throw new Error(`entry must be 1-120 characters, got ${codePoints(LINE)}`);
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (LINE !== LINE.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }

  mkdirSync("/output", { recursive: true });
  writeFileSync(OUT_PATH, LINE, "utf8");

  // Read-back verification: the bytes on disk must be exactly the line.
  const back = readFileSync(OUT_PATH, "utf8");
  if (back !== LINE) {
    throw new Error("read-back mismatch: /output/entry.txt differs from entry");
  }
  // Byte-level verification: no trailing newline byte, byte length matches.
  const raw = readFileSync(OUT_PATH);
  const expectedBytes = Buffer.byteLength(LINE, "utf8");
  if (raw.length !== expectedBytes) {
    throw new Error(
      `byte length mismatch: file has ${raw.length} bytes, entry has ${expectedBytes}`,
    );
  }
  if (raw.length > 0 && raw[raw.length - 1] === 0x0a) {
    throw new Error("entry must not end with a newline byte");
  }
  console.log(`wrote ${codePoints(LINE)} characters to ${OUT_PATH}`);
}

main();
