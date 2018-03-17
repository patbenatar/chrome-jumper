function storageGet(items: string | string[]): Promise<{ [key: string]: any }> {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get(items, resolve)
  })
}

export { storageGet }
