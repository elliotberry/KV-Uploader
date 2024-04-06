import { readdir, readFile, writeFile } from "fs/promises"
import { exec } from "child_process"
import { join, basename } from "path"
import { promisify } from "util"
import path from "path"
import req from "./req.js"
import { fdir } from "fdir"
import { relative } from "path"
import mime from "mime-types"
import {fileTypeFromFile} from 'file-type';

const main = async () => {
const fileContent = await readFile("./img.jpg", { encoding: "base64" });
  await writeFile("./output.txt", fileContent);
  console.log("done");
}

main().catch(console.error)

