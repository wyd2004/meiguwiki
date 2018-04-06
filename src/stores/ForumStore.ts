import axios from 'axios'
import { action, observable, remove, runInAction, set } from 'mobx'
import uuidv4 from 'uuid/v4'
import { RefreshState } from '../components/RefreshListView'
import { IArticle } from './ArticleStore'

export interface IForum {
  fid: number
  page: number
  refreshState: RefreshState
  articles: IArticle[]
  lastUpdateId: string
}

export class ForumHandler {
  constructor (
    private fid: number,
    private store: ForumStore
  ) {
    if (store.forumRefCount[fid]) {
      store.forumRefCount[fid]++
    } else {
      store.forumRefCount[fid] = 1
      set(this.store.forums, this.fid.toString(), this.emptyForum())
    }
  }
  @action async loadMoreArticles (refresh = false) {
    let forum = this.get()
    if (refresh) {
      forum = observable.object({
        ...this.emptyForum(),
        articles: forum.articles
      } as IForum)
      set(this.store.forums, this.fid.toString(), forum)
    }
    if (forum.refreshState === RefreshState.HeaderRefreshing) return
    if (forum.refreshState === RefreshState.FooterRefreshing && !refresh) return
    if (forum.refreshState === RefreshState.NoMoreData && !refresh) return
    const isRefresh = forum.page === -1
    forum.refreshState = isRefresh ? RefreshState.HeaderRefreshing : RefreshState.FooterRefreshing
    forum.page++
    try {
      const res = await axios.get(`tasks/${this.fid}/${forum.page * 10}`)
      runInAction(() => {
        forum.refreshState = res.data.tasks.length <= 0 ? RefreshState.NoMoreData : RefreshState.Idle
        if (isRefresh) forum.articles = []
        for (const article of res.data.tasks) {
          forum.articles.push({
            tid: article.tid,
            fid: article.fid,
            userName: article.username,
            subject: article.subject.trim(),
            timestamp: article.last_date,
            views: article.views,
            url: article.url
          })
        }
        forum.lastUpdateId = uuidv4()
      })
    } catch (e) {
      runInAction(() => {
        forum.refreshState = RefreshState.Failure
        throw e
      })
    }
  }
  get () {
    return this.store.forums[this.fid]
  }
  @action destroy () {
    this.store.forumRefCount[this.fid]--
    if (this.store.forumRefCount[this.fid] <= 0) {
      delete this.store.forumRefCount[this.fid]
      remove(this.store.forums, this.fid.toString())
    }
  }
  private emptyForum () {
    return {
      fid: this.fid,
      page: -1,
      refreshState: RefreshState.Idle,
      articles: [],
      lastUpdateId: uuidv4()
    }
  }
}

export class ForumStore {
  @observable forums: { [fid: number]: IForum } = {}
  forumRefCount: { [tid: number]: number } = {}

  openForum (fid: number) {
    return new ForumHandler(fid, this)
  }
}
