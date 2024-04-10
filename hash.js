import { open } from "node:fs/promises"
import { createHash } from "node:crypto"

const promiseToHash = (rs) => {
  return new Promise(function (resolve, reject) {
    const hash = createHash("sha256")
    rs.on("data", (data) => hash.update(data))
      .on("end", () => resolve(hash.digest("hex")))
      .on("error", (error) => {
        reject(error)
      })
  })
}

// Hashes a file using SHA256
const hashIt = async (filePath) => {
  let filehandle = await open(filePath)
  let rs = filehandle.createReadStream()
  let hash = await promiseToHash(rs)
  await filehandle.close()
  return hash
}

export default hashIt
