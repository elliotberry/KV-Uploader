import { html } from "itty-router"

const staticServer = async (request, env, kvNamespaceID = "static") => {
  try {
    let url = new URL(request.url)
    let path = url.pathname
    path = path.replace(/^\/+/, "")
    if (path === "") {
      path = "index.html"
    }
    const { metadata, value } = await env[kvNamespaceID].getWithMetadata(path, {
      type: "arrayBuffer"
    })
    if (!metadata || !value) {
      return html("No", { status: 404 })
    }
    let fileData = value
    let mime = metadata.mimeType
    if (fileData) {
      return new Response(fileData, {
        headers: {
          "Content-Type": mime
        }
      })
    } else {
      return html("file not found", { status: 404 })
    }
  } catch (error) {
    console.error(error)
    return html("error in static server", { status: 500 })
  }
}

export default staticServer
