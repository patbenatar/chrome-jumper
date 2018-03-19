const base = require('../manifest-base.json')

export function createManifest() {
  base.name = 'Jumper: GitHub'
  base.description = 'Typeahead search and jump to your GitHub repos'
  base.omnibox = { keyword: 'gh' }
  return base
}
