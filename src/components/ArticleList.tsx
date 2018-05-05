import { observer } from 'mobx-react'
import * as React from 'react'
import {
  ListRenderItem,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'
import Toast from 'react-native-root-toast'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import FeatherIcon from 'react-native-vector-icons/Feather'
import {
  NavigationActions,
  NavigationScreenConfig,
  NavigationScreenProps
} from 'react-navigation'
import * as colors from '../colors'
import { RefreshListView } from '../components/RefreshListView'
import { IArticleNavParams } from '../pages/Article'
import { IWebBrowserNavParams } from '../pages/WebBrowser'
import { store } from '../stores'
import { IArticle } from '../stores/ArticleStore'
import { ForumHandler } from '../stores/ForumStore'
import { formatTime } from '../utils'

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: colors.listContainerBgColor
  } as ViewStyle,
  listSeparator: {
    height: 1,
    backgroundColor: colors.listSeparatorColor
  } as ViewStyle,
  listShorterSeparator: {
    height: 1,
    backgroundColor: colors.listSeparatorColor,
    marginHorizontal: 16
  } as ViewStyle,
  listItemContainer: {
    padding: 15
  } as ViewStyle,
  listItemSubjectText: {
    color: colors.mainTextColorOnLightBg,
    fontSize: 16,
    marginBottom: 8
  } as TextStyle,
  listItemLine: {
    flexDirection: 'row',
    alignItems: 'center'
  } as ViewStyle,
  listItemDateTimeText: {
    color: colors.accessoryTextColorOnLightBg,
    fontSize: 12,
    flexGrow: 1
  } as TextStyle,
  viewsText: {
    color: colors.accessoryTextColorOnLightBg,
    fontSize: 12,
    marginLeft: 5
  },
  listItemRowContainer: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  listItemRowText: {
    color: colors.mainTextColorOnLightBg,
    fontSize: 16,
    flexGrow: 1
  } as TextStyle
})

type JumpMode = 'article-page' | 'in-app-browser'
type ListMode = 'detail' | 'simple'

@observer
class ListCell extends React.Component<IArticle & NavigationScreenProps & {
  jumpMode: JumpMode;
  listMode: ListMode;
  isFirst: boolean;
  isLast: boolean;
}> {
  onPress = async () => {
    if (this.props.jumpMode === 'in-app-browser') {
      this.props.navigation.navigate('WebBrowser', { url: this.props.url } as IWebBrowserNavParams)
    } else {
      this.props.navigation.navigate('ArticleStack', undefined, NavigationActions.navigate({
        routeName: 'Article',
        params: {
          tid: this.props.tid,
          stubArticle: this.props
        } as IArticleNavParams
      }))
    }
  }
  render () {
    const topBorder = this.props.isFirst ? <View style={styles.listSeparator} /> : undefined
    const bottomBorder = this.props.isLast ? <View style={styles.listSeparator} /> : undefined
    return this.props.listMode === 'simple' ? (
      <View>
        {topBorder}
        <TouchableOpacity style={styles.listItemRowContainer} onPress={this.onPress}>
          <Text style={styles.listItemRowText}>{this.props.subject}</Text>
          <EntypoIcon name="chevron-thin-right" size={20} color={colors.listArrowColor} />
        </TouchableOpacity>
        {bottomBorder}
      </View>
    ) : (
      <View>
        {topBorder}
        <TouchableOpacity style={styles.listItemContainer} onPress={this.onPress}>
          <Text style={styles.listItemSubjectText}>{this.props.subject}</Text>
          <View style={styles.listItemLine}>
            <Text style={styles.listItemDateTimeText}>{formatTime(this.props.timestamp)}</Text>
            <FeatherIcon name="eye" size={14} color={colors.accessoryTextColorOnLightBg} />
            <Text style={styles.viewsText}>{this.props.views}</Text>
          </View>
        </TouchableOpacity>
        {bottomBorder}
      </View>
    )
  }
}

interface IArticleListProps extends NavigationScreenProps {
  jumpMode?: JumpMode
  listMode?: ListMode
  ListHeaderComponent?: JSX.Element
}

export function createArticleList<NavigationOptions = never> (
  fid: number,
  // TODO: FlatList 存在 bug 导致 RefreshControl 首次显示定位有问题，如遇到此问题请将该选项设为 true
  fixRefreshControlBug = false,
  navigationOptions?: NavigationScreenConfig<NavigationOptions>
) {
  @observer
  class ArticleList extends React.Component<IArticleListProps> {
    static navigationOptions = navigationOptions
    static defaultProps: Partial<IArticleListProps> = {
      jumpMode: 'article-page',
      listMode: 'detail'
    }
    forum: ForumHandler
    constructor (props: IArticleListProps) {
      super(props)
      this.forum = store.forumStore.openForum(fid)
    }
    async componentDidMount () {
      try {
        await this.forum.loadMoreArticles(true, fixRefreshControlBug)
      } catch (e) {
        // ignore
      }
    }
    componentWillUnmount () {
      this.forum.destroy()
    }
    listKeyExtractor = (item: IArticle) => item.tid.toString()
    renderListItem: ListRenderItem<IArticle> = ({ item, index, separators }) => {
      const articleCount = store.forumStore.forums[fid].articles.length
      return (
        <ListCell
          navigation={this.props.navigation}
          jumpMode={this.props.jumpMode}
          listMode={this.props.listMode}
          isFirst={index === 0}
          isLast={index === articleCount - 1}
          {...item}
        />
      )
    }
    renderListSeparator = () => {
      return <View style={this.props.listMode === 'simple' ? styles.listShorterSeparator : styles.listSeparator} />
    }
    onHeaderRefresh = async refreshState => {
      try {
        await this.forum.loadMoreArticles(true)
      } catch (e) {
        Toast.show(`刷新失败${e instanceof Error ? `\n${e.message}` : ''}`)
      }
    }
    onFooterRefresh = async refreshState => {
      try {
        await this.forum.loadMoreArticles()
      } catch (e) {
        Toast.show(`加载失败${e instanceof Error ? `\n${e.message}` : ''}`)
      }
    }
    render () {
      const forum = store.forumStore.forums[fid]
      return (
        <RefreshListView
          style={styles.listContainer}
          data={forum.articles}
          extraData={forum.lastUpdateId}
          keyExtractor={this.listKeyExtractor}
          renderItem={this.renderListItem}
          ListHeaderComponent={this.props.ListHeaderComponent}
          ItemSeparatorComponent={this.renderListSeparator}
          refreshState={forum.refreshState}
          onHeaderRefresh={this.onHeaderRefresh}
          onFooterRefresh={this.onFooterRefresh}
        />
      )
    }
  }
  return ArticleList
}
