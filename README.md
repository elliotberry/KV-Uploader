# kv-uploader
![](./icon.jpeg)

> upload binary file blobs to cloudflare workers kv, and then use as a static server for your cloudflare workers project

since cloudflare sites on workers isn't really a thing anymore, this is a simple cli app to uplaod local files to workers kv as binary

1- create a new kv namespace on cloudflare workers. When you add it to wrangler.toml, call it something with the word "static" in the name.

2 - pick a folder in your cloudflare workers project to store the files. I recommend creating a folder called "static" or "public" in the root of your project.

3 - run `kvuploader` in your repositiory, with the public files folder as the first argument. it will upload all files to the kv namespace you created in step 1.

4 - make sure the approproate middleware is in place to serve the files from the kv namespace. An example is included in the root of this repository.