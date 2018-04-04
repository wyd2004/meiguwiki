import { ArticleStore } from './ArticleStore'

class RootStore {
  articleStore = new ArticleStore()
}

export const store = new RootStore()
