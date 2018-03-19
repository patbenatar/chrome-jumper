import { backend, IOptions } from '../backends'

function storageGet(items: string | string[]): Promise<{ [key: string]: any }> {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get(items, resolve)
  })
}

async function getOptions(): Promise<IOptions | undefined> {
  const { options } = await storageGet('options')
  return options !== undefined && JSON.parse(options) || undefined
}

export { storageGet, getOptions }
