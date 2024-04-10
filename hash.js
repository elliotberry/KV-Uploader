import { open } from "node:fs/promises"
import pkg from "xxhash-addon"
const { XXHash3 } = pkg

const promiseToHash = (rs) => {
  return new Promise(function (resolve, rej) {
    const xxh3 = new XXHash3(Buffer.from([0, 0, 0, 0]))
    rs.on("data", (data) => xxh3.update(data))
      .on("end", () => resolve(xxh3.digest().toString("hex")))
      .on("error", (error) => {
        rej(error)
      })
  })
}

// Hashes a file using XXHash3
const hashIt = async (filePath) => {
  let filehandle = await open(filePath)
  let rs = filehandle.createReadStream()
  let hash = await promiseToHash(rs)
  await filehandle.close()
  return hash
}
export default hashIt