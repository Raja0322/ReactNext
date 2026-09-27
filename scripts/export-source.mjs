import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const directories = ["app", "components", "features", "services", "tests", "scripts"];
const rootFiles = ["package.json", "tsconfig.json", "next-env.d.ts", "next.config.ts", "postcss.config.mjs", "eslint.config.mjs", "playwright.config.ts", ".gitignore", "README.md"];

async function listFiles(directory) {
  const entries = await readdir(path.join(projectRoot, directory), { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const relativePath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(relativePath) : [relativePath];
  }));
  return files.flat().sort();
}

const sourceFiles = [...rootFiles, ...(await Promise.all(directories.map(listFiles))).flat()];
const languageByExtension = { ".tsx": "tsx", ".ts": "ts", ".mjs": "js", ".json": "json", ".css": "css", ".md": "markdown" };
const sections = await Promise.all(sourceFiles.map(async (file) => {
  const contents = await readFile(path.join(projectRoot, file), "utf8");
  const language = languageByExtension[path.extname(file)] ?? "text";
  return `FILE: ${file}\n\n\`\`\`\`${language}\n${contents.trimEnd()}\n\`\`\`\`\n`;
}));

await writeFile(path.join(projectRoot, "IMPLEMENTATION.md"), [
  "# Complete implementation\n",
  "The architecture, screenshot analysis, assumptions, and run instructions are in README.md below. Each authored source file is included in full. Generated dependency lockfiles, framework instructions, build output, and browser screenshots are delivered separately in the project.\n",
  "## Project structure\n",
  `\`\`\`text\n${sourceFiles.join("\n")}\n\`\`\`\n`,
  ...sections,
].join("\n"));

console.log(`Exported ${sourceFiles.length} complete files to IMPLEMENTATION.md`);
