import { observer } from 'mobx-react'
import * as React from 'react'
import {
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import {
  NavigationScreenConfig,
  NavigationScreenProps,
  NavigationTabScreenOptions,
  TabBarTop,
  TabNavigator
} from 'react-navigation'
import * as colors from '../colors'
import { RefreshListView } from '../components/RefreshListView'
import { store } from '../stores'
import { IArticle } from '../stores/ArticleStore'
import { formatTime } from '../utils'
import { IArticleNavParams } from './Article'

const styles = StyleSheet.create({
  tabContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.topBarBgColor
  } as ViewStyle,
  listContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.listContainerBgColor
  } as ViewStyle,
  listSeparator: {
    height: 1,
    backgroundColor: colors.listSeparatorColor
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
  }
})

class ListCell extends React.Component<IArticle & NavigationScreenProps> {
  onPress = async () => {
    this.props.navigation.push('Article', {
      tid: this.props.tid,
      stubArticle: this.props
    } as IArticleNavParams)
  }
  render () {
    return (
      <TouchableOpacity style={styles.listItemContainer} onPress={this.onPress}>
        <Text style={styles.listItemSubjectText}>{this.props.subject}</Text>
        <View style={styles.listItemLine}>
          <Text style={styles.listItemDateTimeText}>{formatTime(this.props.timestamp)}</Text>
          <FeatherIcon name="eye" size={14} color={colors.accessoryTextColorOnLightBg} />
          <Text style={styles.viewsText}>{this.props.views}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

function createNewsList (fid: number, forumName: string) {
  @observer
  class NewsList extends React.Component<NavigationScreenProps> {
    static navigationOptions: NavigationScreenConfig<NavigationTabScreenOptions> = {
      title: forumName
    }
    async componentWillMount () {
      await store.forumStore.fetchMoreArticles(fid)
    }
    componentWillUnmount () {
      store.forumStore.unloadForum(fid)
    }
    listKeyExtractor = (item: IArticle) => item.tid.toString()
    renderListItem: ListRenderItem<IArticle> = ({ item }) => <ListCell {...item} navigation={this.props.navigation} />
    renderListSeparator = () => {
      return <View style={styles.listSeparator} />
    }
    onHeaderRefresh = async refreshState => {
      await store.forumStore.fetchMoreArticles(fid, true)
    }
    onFooterRefresh = async refreshState => {
      await store.forumStore.fetchMoreArticles(fid)
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
  return NewsList
}

// tslint:disable-next-line:variable-name
const TopTabNavigator = TabNavigator({
  HotNews: {
    screen: createNewsList(21, '热点新闻'),
    path: 'hot-news'
  },
  Chinese7x24: {
    screen: createNewsList(5, '7x24 中文'),
    path: 'chinese-7x24'
  },
  Blockchain7x24: {
    screen: createNewsList(23, '7x24 区块链'),
    path: 'blockchain-7x24'
  },
  English7x24: {
    screen: createNewsList(6, '7x24 英文'),
    path: 'english-7x24'
  }
}, {
  tabBarComponent: TabBarTop,
  tabBarPosition: 'top',
  swipeEnabled: true,
  animationEnabled: true,
  tabBarOptions: {
    activeTintColor: colors.mainTextColorOnDarkBg,
    inactiveTintColor: colors.accessoryTextColorOnDarkBg,
    style: {
      backgroundColor: colors.topBarBgColor
    },
    indicatorStyle: {
      backgroundColor: colors.mainTextColorOnDarkBg
    },
    labelStyle: {
      fontSize: 15
    }
  }
})

export class News extends React.Component<NavigationScreenProps> {
  static navigationOptions: NavigationScreenConfig<NavigationTabScreenOptions> = {
    tabBarLabel: '资讯',
    tabBarIcon ({ focused, tintColor }) {
      return <FAIcon name="newspaper-o" size={20} color={tintColor} />
    }
  }
  // https://github.com/react-navigation/react-navigation/issues/3598#issuecomment-375622188
  static router = TopTabNavigator.router
  render () {
    return (
      <SafeAreaView style={styles.tabContainer}>
        <TopTabNavigator navigation={this.props.navigation} />
      </SafeAreaView>
    )
  }
}
