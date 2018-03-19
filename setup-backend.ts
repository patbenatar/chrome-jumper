import { writeFileSync, mkdirSync, existsSync } from 'fs'

function setup(backend: string) {
  console.log(`Setting up ${backend} backend.`)

  const { createManifest } = require(`./src/backends/${backend}/manifest`)
  const manifest = createManifest()

  if (!existsSync('./dist')) mkdirSync('./dist')
  writeFileSync('./dist/manifest.json', JSON.stringify(manifest))
}

function main() {
  if (process.env.BACKEND === undefined) {
    console.error('Missing required BACKEND environment variable')
    return
  }

  setup(process.env.BACKEND)
}

main()
