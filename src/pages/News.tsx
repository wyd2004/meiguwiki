import * as React from 'react'
import { Button, SafeAreaView, StyleSheet, ViewStyle } from 'react-native'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import {
  NavigationScreenConfig,
  NavigationScreenProps,
  NavigationTabScreenOptions,
  TabBarTop,
  TabNavigator
} from 'react-navigation'
import * as colors from '../colors'

function createNewsList (fid: number, forumName: string) {
  return class NewsList extends React.Component<NavigationScreenProps> {
    static navigationOptions: NavigationScreenConfig<NavigationTabScreenOptions> = {
      title: forumName
    }
    openArticle = () => {
      this.props.navigation.push('Article', {
        tid: 6216
      })
    }
    render () {
      return (
        <Button title="文章页" color="#57bae8" onPress={this.openArticle} />
      )
    }
  }
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

const styles = StyleSheet.create({
  tabContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.topBarBgColor
  } as ViewStyle
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
