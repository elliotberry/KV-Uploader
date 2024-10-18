import chalk from "chalk";
import { readFile } from "node:fs/promises";
import path from "node:path";
import request from "./lib/request.js";
import mime from "mime-types"

function getMimeType(filePath) {
  const extension = path.extname(filePath).slice(1)
  let mimetype = mime.lookup(extension)
  return mimetype
}


export async function uploadFileToKV(namespace, filePath, key) {
  try {
    const fileContent = await readFile(filePath, { encoding: "base64" });
    const mime = getMimeType(filePath);

    if (!mime) {
      throw new Error(`Failed to get mime type for ${filePath}`);
    }

    await request(namespace, key, mime, fileContent);
    console.log(
      chalk.green(
        `Uploaded ${path.basename(filePath)} to ${namespace} with key ${key}`
      )
    );
  } catch (error) {
    console.error(chalk.red(`Failed to upload file: ${error.message}`));
  }
}