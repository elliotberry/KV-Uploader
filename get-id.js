import fs from "node:fs/promises"
import toml from "toml"

//
// gets name of namespace from local wrangler.toml file
//


const getStatic = (array) => {
  let returnValue = null

  for (const element of array) {
    if (element.binding.includes("static")) {
      returnValue = element.id
    }
  }
  return returnValue
}

const parse = (data) => {
  let returnValue = null

  if (data.kv_namespaces) {
    returnValue = getStatic(data.kv_namespaces)
  }
  if (data.env) {
    for (const environ in data.env) {
      let returnValue_ = getStatic(data.env[environ].kv_namespaces)
      if (returnValue_ !== null) {
        returnValue = returnValue_
        break
      }
    }
  }
  return returnValue
}

const getWranglerStaticKVID = async () => {
  let data = await fs.readFile(`${process.cwd()}/wrangler.toml`, "utf8")
  var data3 = toml.parse(data)
  let staticID = parse(data3)

  return staticID
}

export default getWranglerStaticKVID
