import chalk from "chalk"
import { fdir } from "fdir"
import mime from "mime-types"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { relative } from "node:path"

import getID from "./getID.js"
import request from "./req.js"

function getMimeType(filePath) {
  const extension = path.extname(filePath).slice(1)
  let mimetype = mime.lookup(extension)
  return mimetype
}

async function uploadFileToKV(namespace, filePath, key) {
  const fileContent = await readFile(filePath, { encoding: "base64" })
  const mime = getMimeType(filePath)
  try {
    await request(namespace, key, mime, fileContent)
    console.log(
      chalk.green(
        `Uploaded ${path.basename(filePath)} to ${namespace} with key ${key}`
      )
    )
  } catch (error) {
    console.error(chalk.red(`Failed to upload file: ${error.message}`))
  }
}

async function getRelativePath(fromDirectory, fullPath) {
  return relative(fromDirectory, fullPath)
}

//49f7b663e6244e179d626b5e9f24254a
async function main() {
  const arguments_ = process.argv.slice(2)
  const [folderPath] = arguments_
  //let namespace = "49f7b663e6244e179d626b5e9f24254a"
  let namespace = await getID()
  let files = await new fdir().withFullPaths().crawl(folderPath).withPromise()
  for await (const file of files) {
    let key = await getRelativePath(folderPath, file)
    await uploadFileToKV(namespace, file, key)
  }
}

main()
