// https://github.com/skyra-project/skyra/blob/3a7ac7160ec15518e82611b1ec2d19cc04373398/scripts/build/grpc.mjs
// https://uwu.evie.pw/DiscordCanary_MA52JJ7KMz.png
// @ts-check
import { gray, green, red } from "colorette";
import { execFile } from "node:child_process";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import genConf from "../gen-conf.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, "..");
const protoDirectory = join(rootDir, "protos");
const generatedDirectory = join(rootDir, "gen", "grpc");

const print = console.log;

async function getSourceProtoFiles() {
  const protoFiles = await readdir(protoDirectory);
  return protoFiles.filter((file) => file.endsWith(".proto"));
}

/**
 * @param {string} directory
 * @param {readonly string[]} files
 */
function printFiles(directory, files) {
  if (files.length === 0) return;

  const mid = files.slice(0, -1);
  const last = files[files.length - 1];

  print(
    gray(
      `Processed ${green(files.length.toString())} file${
        files.length === 1 ? "" : "s"
      }!`
    )
  );
  for (const file of mid) print(gray(`├─ ${directory}${sep}${green(file)}`));
  print(gray(`└─ ${directory}${sep}${green(last)}`));
}

async function prepareGeneratedDirectory() {
  await mkdir(generatedDirectory, { recursive: true });
}

const isWindows = process.platform === "win32";

async function addIndex() {
  const ignored = ["shared_grpc_pb.js"];
  const files = await readdir(generatedDirectory);
  const filtered = files.filter(
    (file) => !ignored.includes(file) && file.endsWith(".js")
  );

  const indexFile = join(generatedDirectory, "index.ts");
  const content = filtered
    .map((file) => `export * from './${file.slice(0, -3)}';\n`)
    .join("");
  await writeFile(indexFile, content, "utf-8");

  printFiles(generatedDirectory, filtered);
}

async function generate() {
  const files = await getSourceProtoFiles();
  printFiles(protoDirectory, files);

  await prepareGeneratedDirectory();

  const execFileAsync = promisify(execFile);
  const protoc = join(
    rootDir,
    "node_modules",
    ".bin",
    isWindows ? "grpc_tools_node_protoc.cmd" : "grpc_tools_node_protoc"
  );
  await execFileAsync(protoc, [
    `--proto_path=${protoDirectory}`,
    `--js_out=import_style=commonjs,binary:${generatedDirectory}`,
    `--grpc_out=grpc_js,import_style=commonjs:${generatedDirectory}`,
    ...files,
  ]);

  const protoGenTypeScript = join(
    rootDir,
    "node_modules",
    ".bin",
    isWindows ? "protoc-gen-ts.cmd" : "protoc-gen-ts"
  );
  await execFileAsync(protoc, [
    `--plugin=protoc-gen-ts=${protoGenTypeScript}`,
    `--proto_path=${protoDirectory}`,
    `--ts_out=grpc_js:${generatedDirectory}`,
    ...files,
  ]);

  await addIndex();

  // Print status
  print(gray(`Successfully ${green("generated")} gRPC files!`));

  await move();

  // Print status
  print(gray(`Successfully ${green("moved")} gRPC files!`));
}

async function move() {
  genConf.grpc.forEach(async (outputDirArray) => {
    const outputDir = join(rootDir, ...outputDirArray);
    const files = await readdir(generatedDirectory);
    await Promise.all(
      files.map(async (file) => {
        const filePath = join(generatedDirectory, file);
        const outputFilePath = join(outputDir, file);
        await mkdir(dirname(outputFilePath), { recursive: true });
        await writeFile(outputFilePath, await readFile(filePath, "utf-8"));
      })
    );
  });
}

async function clean() {
  await rm(generatedDirectory, { recursive: true });

  // Print status
  print(gray(`Successfully ${red("deleted")} gRPC files!`));
}

try {
  await prepareGeneratedDirectory();
  await clean();
  await generate();
} catch (error) {
  console.error(error.stack);
  process.exit(1);
}
