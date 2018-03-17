const originalRequestAllPages = require('request-all-pages')
import promisify from 'promisify-node'
import { flatMap } from 'lodash'
import { storageGet } from './storage'

interface IRepo {
  full_name: string
}

interface IReposPage {
  body: IRepo[]
}

interface ICachedRepos {
  cachedRepos: string[]
}

const requestAllPages = promisify(originalRequestAllPages)

async function hasCachedRepos(): Promise<boolean> {
  const { cachedRepos } = await storageGet('cachedRepos') as ICachedRepos
  return cachedRepos !== undefined
}

async function getRepos(apiKey: string): Promise<string[]> {
  const { cachedRepos } = await storageGet('cachedRepos') as ICachedRepos

  // TODO: invalidate cache, or background refresh after X time

  if (cachedRepos) {
    console.log('serving from cache')

    return cachedRepos
  } else {
    console.log('fetching repos')

    const pages = await requestAllPages({
      uri: 'https://api.github.com/user/repos',
      headers: {
        'Authorization': `token ${apiKey}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Chrome Jumper'
      },
      json: true
    })

    const repos = flatMap(pages, (p: IReposPage) => p.body.map((r: IRepo) => r.full_name))

    chrome.storage.local.set({ cachedRepos: repos })

    return repos;
  }
}

export { getRepos, hasCachedRepos }
