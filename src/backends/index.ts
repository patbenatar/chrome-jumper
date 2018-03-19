import { IOptions } from './current'

export interface ISearchResult {
  title: string
}

export interface IBackend {
  hasCache: () => Promise<boolean>
  search: (query: string, options: IOptions) => Promise<ISearchResult[]>
  select: (itemTitle: string, options: IOptions) => void
}
