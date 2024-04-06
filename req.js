
const req = async (namespace, key, mime, value) => {

  let url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${namespace}/bulk`

  let options = {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "X-Auth-Email": process.env.CLOUDFLARE_API_EMAIL,
      "X-Auth-Key": process.env.CLOUDFLARE_API_KEY
    }
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

export default req
