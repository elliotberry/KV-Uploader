const request = async (namespace, key, mime, value) => {
  if (!mime || mime === "" || mime === null) {
    throw new Error("no mime")
  }
  if (!namespace || !key || !value) {
    throw new Error("need args")
  }
  let url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${namespace}/bulk`

  let options = {
    headers: {
      "X-Auth-Email": process.env.CLOUDFLARE_API_EMAIL,
      "X-Auth-Key": process.env.CLOUDFLARE_API_KEY,
      "content-type": "application/json"
    },
    method: "PUT"
  }
  let bod = [
    {
      base64: true,
      key: key,
      metadata: { mimeType: mime },
      value: value
    }
  ]
  options.body = JSON.stringify(bod)

  let resp = await fetch(url, options).then((res) => res.json())

  if (resp.success === false) {
    throw new Error(`Failed to upload file: ${resp.errors[0].message}`)
  }
}

export default request
