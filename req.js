import FormData from "form-data"

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
      base64: false,
 
      key: key,
      metadata: { mime: mime },
      value: value
    }
  ]
  options.body = JSON.stringify(bod)

  let resp = await fetch(url, options).then((res) => res.json())

  console.log(resp)
}

export default req
