import { relative } from "node:path"

import { fdir } from "fdir"
import { minimatch } from "minimatch"

import { putInCache, shouldUpload } from "./lib/cache.js"
import getID from "./lib/get-id.js"
import { uploadFileToKV } from "./upload-file-to-kv.js"

async function getRelativePath(fromDirectory, fullPath) {
  return relative(fromDirectory, fullPath)
}

async function main() {
  const arguments_ = process.argv.slice(2)
  const [folderPath] = arguments_

  let namespace = await getID()
  let files = await new fdir().withFullPaths().crawl(folderPath).withPromise()

  //filter dumb shit
  let finalFiles = []
  let ignores = [".DS_Store"]
  for await (const file of files) {
    let remove = false
    for await (const ignore of ignores) {
      remove = minimatch(file, ignore, { matchBase: true })
      if (remove) {
        break
      }
    }
    if (remove === false) {
      finalFiles.push(file)
    }
  }

  for await (const file of finalFiles) {
    let key = await getRelativePath(folderPath, file)
    let needToUpload = await shouldUpload(namespace, key, file)

    if (needToUpload) {
      await uploadFileToKV(namespace, file, key)
      await putInCache(namespace, key, file)
    }
  }
}

main()
