import { storageGet } from './lib/storage'
import { getRepos, hasCachedRepos } from './lib/github'
import { debounce } from 'lodash'

const extensionGetSelf = function(): Promise<chrome.management.ExtensionInfo> {
  return new Promise(function(resolve, reject) {
    chrome.management.getSelf(resolve)
  })
}

async function inputHandler(text: string, suggest: (suggestResults: chrome.omnibox.SuggestResult[]) => void) {
  console.log('input', text)
  const { githubApiKey } = await storageGet('githubApiKey')
  const repos = await getRepos(githubApiKey)
  const results = repos.filter(r => r.indexOf(text) >= 0)

  console.log('results', results)

  if (results.length > 0) {
    chrome.omnibox.setDefaultSuggestion({ description: results[0] })
    suggest(results.slice(1).map((r: string) => { return { description: r, content: r } }))
  } else {
    chrome.omnibox.setDefaultSuggestion({ description: 'No results' })
  }
}

chrome.omnibox.onInputChanged.addListener(async (text: string, suggest: (suggestResults: chrome.omnibox.SuggestResult[]) => void) => {
  const hasCache = await hasCachedRepos()
  const debounceTime = hasCache ? 0 : 333
  debounce(() => inputHandler(text, suggest), debounceTime)()
})

chrome.omnibox.onInputEntered.addListener(async function(text: string) {
  console.log('inputEntered: ' + text)
  const destination = await resolveQueryToDestination(text)
  chrome.tabs.update({ url: destination })
})

chrome.tabs.onCreated.addListener(async function(tab: chrome.tabs.Tab) {
  if (tab.url === undefined) return

  const extensionInfo = await extensionGetSelf()

  var url = document.createElement('a')
  url.href = tab.url

  if (url.protocol === 'chrome-extension:' && url.hostname === extensionInfo.id && url.pathname === '/') {
    const params = new URLSearchParams(url.search.substring(1))
    const query = params.get("q")
    if (query === null) return

    console.log('relevant tab!!', query)

    const destination = await resolveQueryToDestination(query)

    if (tab.id === undefined) return
    chrome.tabs.update(tab.id, { url: destination })
  }
})

async function resolveQueryToDestination(query: string): Promise<string> {
  const destination = 'https://github.com/' + query
  return destination
}
