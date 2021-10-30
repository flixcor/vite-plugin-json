import { createUnplugin } from 'unplugin'
import { promises as fs, existsSync } from 'fs'

const fileRegex = /\.json$/
const encoding = 'utf-8'

async function getExisting(fileName: string) {
  if(existsSync(fileName)) {
    return await fs.readFile(fileName, encoding)
  }
  return ''
}

export const plugin = createUnplugin(() => ({
  name: 'unplugin-json-dts',
  async transform(code, id) {
    if(fileRegex.test(id)) {
      const fileName = id + '.d.ts'
      const [originalJson, existing] = await Promise.all([fs.readFile(id, encoding), getExisting(fileName)])
      const newContent = `declare const json: ${originalJson}
export default json`
      if(newContent !== existing) {
        await fs.writeFile(fileName, newContent, encoding)
      }
    }
    return {code}
  }
}))

export const vitePluginJsonDts = plugin.vite
export const webpackPluginJsonDts = plugin.vite
export const rollupPluginJsonDts = plugin.vite

