import { createHash } from "node:crypto"
import { open } from "node:fs/promises"

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
  const filehandle = await open(filePath)
  const rs = filehandle.createReadStream()
  const hash = await promiseToHash(rs)
  await filehandle.close()
  return hash
}

export default hashIt
