import axios from 'axios'
import { action, observable, remove, runInAction, set } from 'mobx'

export interface IArticle {
  tid?: number
  userName?: string
  subject?: string
  message?: string
  dateTime?: string
  loading?: boolean
}

export class ArticleStore {
  @observable articles: { [tid: string]: IArticle } = {}
  @action async fetchArticle (tid: number, stubArticle?: IArticle) {
    const article = observable.object(stubArticle || {})
    set(article, {
      loading: true
    } as IArticle)
    set(this.articles, tid.toString(), article)
    const res = await axios.get(`msg/${tid}`)
    runInAction(() => {
      if (res.data.messages.length <= 0) {
        throw new Error('文章不存在')
      }
      const msg = res.data.messages[0]
      set(article, {
        tid: msg.tid,
        userName: msg.username,
        subject: msg.subject,
        message: msg.message,
        dateTime: msg.last_date,
        loading: false
      } as IArticle)
    })
  }
  @action unloadArticle (tid: number) {
    remove(this.articles, tid.toString())
  }
}
