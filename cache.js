import fs from "node:fs/promises"

import hashit from "./hash.js"
let localCachePath = () => `${process.cwd()}/.kvupload.json`

const open = async (path) => {
  let data = { files: [] }

  try {
    let theData = await fs.readFile(localCachePath(), "utf8")
    data = JSON.parse(theData)
  } catch(e) {
    console.log("No cache file found, creating one")
    await fs.writeFile(localCachePath(), JSON.stringify(data, null, 2))
  }
  return data
}
const write = async (data) => {
  await fs.writeFile(localCachePath(), JSON.stringify(data, null, 2))
}

const putInCache = async (namespace, key, file) => {
  let data = await open()
  let hash = await hashit(file)

  let filteredArray = data.files.filter((f) => f.hash !== hash)
  filteredArray.push({
    file,
    key,
    namespace,
    hash
  })
let newData = { files: filteredArray }
  await write(newData)
}
const shouldUpload = async (namespace, key, file) => {
  let data = await open()
  let hash = await hashit(file)
  let found = data.files.find((f) => f.hash === hash)

  if (!found) {
    return true
  }
  if (found.hash !== hash) {
    return true
  }
  if (found.namespace !== namespace) {
    return true
  }
  if (found.key !== key) {
    return true
  }
  return false
}

export { putInCache, shouldUpload }
