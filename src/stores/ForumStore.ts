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

export class ForumStore {
  @observable forums: { [fid: number]: IForum } = {}
  @action async fetchMoreArticles (fid: number, refresh = false) {
    let forum = this.forums[fid]
    if (!forum || refresh) {
      forum = observable.object({
        fid,
        page: -1,
        refreshState: RefreshState.Idle,
        articles: refresh ? forum.articles : [],
        lastUpdateId: uuidv4()
      })
      set(this.forums, fid.toString(), forum)
    }
    if (forum.refreshState === RefreshState.HeaderRefreshing) return
    if (forum.refreshState === RefreshState.FooterRefreshing && !refresh) return
    if (forum.refreshState === RefreshState.NoMoreData && !refresh) return
    const isRefresh = forum.page === -1
    forum.refreshState = isRefresh ? RefreshState.HeaderRefreshing : RefreshState.FooterRefreshing
    forum.page++
    try {
      const res = await axios.get(`tasks/${fid}/${forum.page * 10}`)
      runInAction(() => {
        forum.refreshState = res.data.tasks.length <= 0 ? RefreshState.NoMoreData : RefreshState.Idle
        if (isRefresh) forum.articles = []
        for (const article of res.data.tasks) {
          forum.articles.push({
            tid: article.tid,
            fid: article.fid,
            userName: article.username,
            subject: article.subject,
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
  @action unloadForum (fid: number) {
    remove(this.forums, fid.toString())
  }
}
