import axios from 'axios'
import { action, observable, runInAction, set } from 'mobx'

export interface IArticle {
  tid?: number
  fid?: number
  userName?: string
  subject?: string
  abstract?: string
  message?: string
  copyText?: string
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
      if (!this.get()) {
        set(this.store.articles, this.tid.toString(), this.emptyArticle())
      }
    }
  }
  @action async load (stubArticle?: IArticle) {
    const article = this.get()
    if (stubArticle) set(article, stubArticle)
    if (!article.message) {
      set(article, {
        loading: true
      } as IArticle)
    }
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
        copyText: msg.copytxt,
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
      // 缓存文章，不真正删除
    }
  }
  private emptyArticle (): IArticle {
    return {
      tid: this.tid,
      fid: undefined,
      userName: undefined,
      subject: undefined,
      abstract: undefined,
      message: undefined,
      copyText: undefined,
      timestamp: undefined,
      views: undefined,
      loading: false,
      url: undefined
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
