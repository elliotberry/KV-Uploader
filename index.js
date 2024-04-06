import { readdir, readFile, writeFile } from "fs/promises"
import { join} from "path"

import path from "path"
import req from "./req.js"
import { fdir } from "fdir"
import { relative } from "path"
import mime from "mime-types"
import chalk from "chalk"

function getMimeType(filePath) {
  const extension = path.extname(filePath).slice(1)
  let mimetype = mime.lookup(extension)
  return mimetype
}

async function uploadFileToKV(namespace, filePath, key) {
  const fileContent = await readFile(filePath, { encoding: "base64" })

  const mime = getMimeType(filePath)
  try {
    await req(namespace, key, mime, fileContent)
    console.log(
      chalk.green(`Uploaded ${path.basename(filePath)} to ${namespace} with key ${key}`)
    )
  } catch (error) {
    console.error(chalk.red(`Failed to upload file: ${error.message}`))
  }
}


async function getRelativePath(fromDir, fullPath) {
  return relative(fromDir, fullPath)
}
//49f7b663e6244e179d626b5e9f24254a
async function main() {
  const args = process.argv.slice(2)
  const [folderPath] = args
  let namespace = "49f7b663e6244e179d626b5e9f24254a"
  let files = await new fdir().withFullPaths().crawl(folderPath).withPromise()
  for await (const file of files) {
    let key = await getRelativePath(folderPath, file)
    await uploadFileToKV(namespace, file, key)
  }
}

main()
