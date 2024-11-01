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
  if (data.env) {
    for (const environ in data.env) {
      const returnValue_ = getStatic(data.env[environ].kv_namespaces)
      if (returnValue_ !== null) {
        return returnValue_
      }
    }
  }
  return data.kv_namespaces ? getStatic(data.kv_namespaces) : null
}

const getWranglerStaticKVID = async () => {
  const data = await fs.readFile(`${process.cwd()}/wrangler.toml`, "utf8")
  const data3 = toml.parse(data)

  return parse(data3)
}

export default getWranglerStaticKVID
