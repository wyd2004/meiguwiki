import { ArticleStore } from './ArticleStore'
import { ForumStore } from './ForumStore'

class RootStore {
  articleStore = new ArticleStore()
  forumStore = new ForumStore()
}

export const store = new RootStore()
