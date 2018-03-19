import { storageGet, getOptions } from './lib/storage'
import { backend, ISearchResult } from './backends'
import { debounce } from 'lodash'

const extensionGetSelf = function(): Promise<chrome.management.ExtensionInfo> {
  return new Promise(function(resolve, reject) {
    chrome.management.getSelf(resolve)
  })
}

function promptMissingAPIKey() {
  chrome.omnibox.setDefaultSuggestion({
    description: 'Missing API key. Please configure in extension options.'
  })
}

type SuggestCallback = (suggestResults: chrome.omnibox.SuggestResult[]) => void

async function inputHandler(text: string, suggest: SuggestCallback) {
  const options = await getOptions()
  if (options === undefined) {
    promptMissingAPIKey()
    return
  }

  const results = await backend.search(text, options)

  if (results.length > 0) {
    chrome.omnibox.setDefaultSuggestion({ description: results[0].title })

    const suggestions = results.slice(1).map((r: ISearchResult) => {
      return { description: r.title, content: r.title }
    })

    suggest(suggestions)
  } else {
    chrome.omnibox.setDefaultSuggestion({ description: 'No results' })
  }
}

chrome.omnibox.onInputChanged.addListener(async (text: string, suggest: SuggestCallback) => {
  const hasCache = await backend.hasCache()
  const debounceTime = hasCache ? 0 : 333
  debounce(() => inputHandler(text, suggest), debounceTime)()
})

chrome.omnibox.onInputEntered.addListener(async function(text: string) {
  const options = await getOptions()
  if (options === undefined) {
    promptMissingAPIKey()
    return
  }

  backend.select(text, options)
})

chrome.tabs.onCreated.addListener(async function(tab: chrome.tabs.Tab) {
  if (tab.url === undefined) return

  const options = await getOptions()
  if (options === undefined) return

  const extensionInfo = await extensionGetSelf()

  var url = document.createElement('a')
  url.href = tab.url

  if (url.protocol === 'chrome-extension:' && url.hostname === extensionInfo.id && url.pathname === '/') {
    const params = new URLSearchParams(url.search.substring(1))
    const query = params.get("q")
    if (query === null) return

    backend.select(query, options)
  }
})
