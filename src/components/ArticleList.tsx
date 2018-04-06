import { observer } from 'mobx-react'
import * as React from 'react'
import {
  Linking,
  ListRenderItem,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import FeatherIcon from 'react-native-vector-icons/Feather'
import {
  NavigationScreenConfig,
  NavigationScreenProps
} from 'react-navigation'
import * as colors from '../colors'
import { RefreshListView } from '../components/RefreshListView'
import { IArticleNavParams } from '../pages/Article'
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

@observer
class ListCell extends React.Component<IArticle & NavigationScreenProps & {
  jumpMode: boolean;
  isFirst: boolean;
  isLast: boolean;
}> {
  onPress = async () => {
    if (this.props.jumpMode) {
      if (Linking.canOpenURL(this.props.url)) {
        await Linking.openURL(this.props.url)
      }
    } else {
      this.props.navigation.push('Article', {
        tid: this.props.tid,
        stubArticle: this.props
      } as IArticleNavParams)
    }
  }
  render () {
    const topBorder = this.props.isFirst ? <View style={styles.listSeparator} /> : undefined
    const bottomBorder = this.props.isLast ? <View style={styles.listSeparator} /> : undefined
    return this.props.jumpMode ? (
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

interface IArticleListProps {
  /**
   * 是否启用跳转模式，即点击后用浏览器打开文章 URL
   *
   * @default false
   * @type {boolean}
   * @memberof IArticleListProps
   */
  jumpMode?: boolean
}

export function createArticleList<NavigationOptions = never> (
  fid: number,
  navigationOptions?: NavigationScreenConfig<NavigationOptions>
) {
  @observer
  class ArticleList extends React.Component<IArticleListProps & NavigationScreenProps> {
    static navigationOptions = navigationOptions
    static defaultProps: Partial<IArticleListProps> = {
      jumpMode: false
    }
    forum: ForumHandler
    async componentWillMount () {
      this.forum = store.forumStore.openForum(fid)
      await this.forum.loadMoreArticles(true)
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
          isFirst={index === 0}
          isLast={index === articleCount - 1}
          {...item}
        />
      )
    }
    renderListSeparator = () => {
      return <View style={this.props.jumpMode ? styles.listShorterSeparator : styles.listSeparator} />
    }
    onHeaderRefresh = async refreshState => {
      await this.forum.loadMoreArticles(true)
    }
    onFooterRefresh = async refreshState => {
      await this.forum.loadMoreArticles()
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
