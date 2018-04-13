import axios from 'axios'
import { action, observable, remove, runInAction, set } from 'mobx'
import { Platform } from 'react-native'
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
  // delaySetLoading: FlatList 存在 bug 导致 RefreshControl 首次显示定位有问题，等待片刻完成布局后再设置刷新状态
  @action async loadMoreArticles (refresh = false, delaySetLoading = false) {
    // tslint:disable-next-line:no-parameter-reassignment
    if (Platform.OS !== 'ios') delaySetLoading = false
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
    const newRefreshState = isRefresh ? RefreshState.HeaderRefreshing : RefreshState.FooterRefreshing
    let delaySetLoadingTimer: number
    if (delaySetLoading) {
      delaySetLoadingTimer = setTimeout(() => {
        runInAction(() => {
          forum.refreshState = newRefreshState
        })
      }, 250)
    } else {
      forum.refreshState = newRefreshState
    }
    try {
      const res = await axios.get(`tasks/${this.fid}/${(forum.page + 1) * 10}`)
      runInAction(() => {
        forum.page++
        if (delaySetLoading) clearTimeout(delaySetLoadingTimer)
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
        if (delaySetLoading) clearTimeout(delaySetLoadingTimer)
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
  private emptyForum (): IForum {
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
