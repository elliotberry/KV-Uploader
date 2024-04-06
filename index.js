import { readdir, readFile } from "fs/promises"
import { exec } from "child_process"
import { join, basename } from "path"
import { promisify } from "util"
import path from "path"
import req from "./req.js"



function getMimeType(filePath) {
  const extension = filePath.split(".").pop()
  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    txt: "text/plain",
    html: "text/html",
    js: "application/javascript",
    json: "application/json"
    // Add more MIME types based on your needs
  }
  return mimeTypes[extension] || "application/octet-stream"
}

async function uploadFileToKV(namespace, filePath) {
  const fileContent = await readFile(filePath, { encoding: "base64" })
  const mime = getMimeType(filePath)
  const key = basename(filePath)
  await req(namespace, key, mime, fileContent)
  console.log(
    `Uploaded ${filePath} to KV namespace ${namespace} with key ${key}`
  )
}

async function processFiles(folderPath, namespace) {
  try {
    const files = await readdir(path.resolve(folderPath))
    for await (const file of files) {
      const filePath = join(folderPath, file)

      await uploadFileToKV(namespace, filePath)
    }
  } catch (error) {
    console.error("Error processing files:", error)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const [folderPath, namespace] = args
  await processFiles(folderPath, "49f7b663e6244e179d626b5e9f24254a")
 
}

main()
