import axios from 'axios'
import { action, observable, remove, runInAction, set } from 'mobx'

export interface IArticle {
  tid?: number
  fid?: number
  userName?: string
  subject?: string
  abstract?: string
  message?: string
  timestamp?: number
  views?: number
  loading?: boolean
  url?: string
}

export class ArticleHandler {
  constructor (
    private tid: number,
    private store: ArticleStore
  ) {
    if (store.articleRefCount[tid]) {
      store.articleRefCount[tid]++
    } else {
      store.articleRefCount[tid] = 1
      set(this.store.articles, this.tid.toString(), { tid } as IArticle)
    }
  }
  @action async load (stubArticle?: IArticle) {
    const article = this.get()
    if (stubArticle) set(article, stubArticle)
    set(article, {
      loading: true
    } as IArticle)
    const res = await axios.get(`msg/${this.tid}`)
    runInAction(() => {
      if (res.data.messages.length <= 0) {
        throw new Error('文章不存在')
      }
      const msg = res.data.messages[0]
      set(article, {
        tid: msg.tid,
        userName: msg.username,
        abstract: msg.abstract,
        subject: msg.subject.trim(),
        message: msg.message,
        timestamp: msg.last_date,
        url: msg.url,
        loading: false
      } as IArticle)
    })
  }
  get () {
    return this.store.articles[this.tid]
  }
  @action destroy () {
    this.store.articleRefCount[this.tid]--
    if (this.store.articleRefCount[this.tid] <= 0) {
      delete this.store.articleRefCount[this.tid]
      remove(this.store.articles, this.tid.toString())
    }
  }
}

export class ArticleStore {
  @observable articles: { [tid: number]: IArticle } = {}
  articleRefCount: { [tid: number]: number } = {}

  openArticle (tid: number) {
    return new ArticleHandler(tid, this)
  }
}
