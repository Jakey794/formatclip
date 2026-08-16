import { readdir, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDirectory = fileURLToPath(
  new URL("../.output/chrome-mv3/", import.meta.url),
);
const maximumJavaScriptBytes = 225_000;
const maximumCodeBytes = 245_000;
const codeExtensions = new Set([".css", ".html", ".js", ".json"]);

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listFiles(path) : path;
    }),
  );
  return files.flat();
}

const files = await listFiles(outputDirectory);
const sourceMaps = files.filter((file) => file.endsWith(".map"));

if (sourceMaps.length) {
  throw new Error(`Production source maps found: ${sourceMaps.join(", ")}`);
}

const fileSizes = await Promise.all(
  files.map(async (file) => ({ file, bytes: (await stat(file)).size })),
);
const javascriptBytes = fileSizes
  .filter(({ file }) => extname(file) === ".js")
  .reduce((total, { bytes }) => total + bytes, 0);
const codeBytes = fileSizes
  .filter(({ file }) => codeExtensions.has(extname(file)))
  .reduce((total, { bytes }) => total + bytes, 0);

if (javascriptBytes > maximumJavaScriptBytes) {
  throw new Error(
    `JavaScript bundle is ${javascriptBytes} bytes; budget is ${maximumJavaScriptBytes}.`,
  );
}

if (codeBytes > maximumCodeBytes) {
  throw new Error(
    `Built code is ${codeBytes} bytes; budget is ${maximumCodeBytes}.`,
  );
}

console.log(
  `Bundle check passed: ${javascriptBytes} JS bytes, ${codeBytes} total code bytes, no source maps.`,
);
