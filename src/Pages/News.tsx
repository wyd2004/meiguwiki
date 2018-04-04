import * as React from 'react'
import { SafeAreaView, StyleSheet, Text, ViewStyle } from 'react-native'
import { NavigationScreenConfig, NavigationTabScreenOptions, TabBarTop, TabNavigator } from 'react-navigation'
import * as colors from '../colors'

function createNewsList (fid: number, forumName: string) {
  return class NewsList extends React.Component {
    static navigationOptions: NavigationScreenConfig<NavigationTabScreenOptions> = {
      tabBarLabel: () => {
        return forumName
      }
    }
    render () {
      return (
        <Text>{forumName} {fid}</Text>
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

export class News extends React.Component {
  static navigationOptions: NavigationScreenConfig<NavigationTabScreenOptions> = {
    tabBarLabel: '资讯'
  }
  render () {
    return (
      <SafeAreaView style={styles.tabContainer}>
        <TopTabNavigator />
      </SafeAreaView>
    )
  }
}
