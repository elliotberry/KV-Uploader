import toml from "toml"
import fs from "node:fs/promises"

const parse = (data) => {
  let ret = null
  data3.kv_namespaces.forEach((element) => {
    if (element.binding.indexOf("static") > -1) {
      ret = element.id
    }
  })
  return ret
}
const getWranglerStaticKVID = async () => {
  let data = await fs.readFile(`${process.cwd()}/wrangler.toml`, "utf8")
  var data3 = toml.parse(data)
  let staticID = parse(data3)
  return staticID
}

export default getWranglerStaticKVID
