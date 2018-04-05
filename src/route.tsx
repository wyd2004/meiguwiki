import * as React from 'react'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'
import { NavigationTabScreenOptions, StackNavigator, TabNavigator } from 'react-navigation'
import { bottomTabActiveTintColor, bottomTabInactiveTintColor, topBarBgColor } from './colors'
import { createArticleHub } from './components/ArticleHub'
import { About } from './pages/About'
import { Article } from './pages/Article'
import { Temp } from './Temp'

// tslint:disable-next-line:variable-name
export const RootStackNavigator = StackNavigator({
  Hub: {
    screen: TabNavigator({
      News: {
        screen: createArticleHub({
          navigationOptions: {
            tabBarLabel: '资讯',
            tabBarIcon: ({ focused, tintColor }) => <FAIcon name="newspaper-o" size={20} color={tintColor} />
          } as NavigationTabScreenOptions,
          forums: [{
            routeName: 'HotNews',
            fid: 21,
            label: '热点新闻',
            path: 'hot-news'
          }, {
            routeName: 'Chinese7x24',
            fid: 5,
            label: '7x24 中文',
            path: 'chinese-7x24'
          }, {
            routeName: 'Blockchain7x24',
            fid: 23,
            label: '7x24 区块链',
            path: 'blockchain-7x24'
          }, {
            routeName: 'English7x24',
            fid: 6,
            label: '7x24 英文',
            path: 'english-7x24'
          }]
        }),
        path: 'news'
      },
      Navigation: {
        screen: Temp,
        path: 'navigation'
      },
      Discovery: {
        screen: createArticleHub({
          navigationOptions: {
            tabBarLabel: '发现',
            tabBarIcon: ({ focused, tintColor }) => <IoniconsIcon name="md-compass" size={20} color={tintColor} />
          } as NavigationTabScreenOptions,
          forums: [{
            routeName: 'StockCoinTalk',
            fid: 1,
            label: '谈股论币',
            path: 'stock-coin-talk'
          }, {
            routeName: 'UsStockWeekly',
            fid: 2,
            label: '美股周报',
            path: 'us-stock-weekly'
          }, {
            routeName: 'StudyArchive',
            fid: 3,
            label: '学习存档',
            path: 'study-archive'
          }]
        }),
        path: 'discovery'
      },
      About: {
        screen: About,
        path: 'about'
      }
    }, {
      tabBarOptions: {
        activeTintColor: bottomTabActiveTintColor,
        inactiveTintColor: bottomTabInactiveTintColor
      }
    }),
    path: 'hub',
    navigationOptions: {
      // tslint:disable-next-line:no-null-keyword
      header: null
    }
  },
  Article: {
    screen: Article,
    path: 'article/:tid'
  }
}, {
  initialRouteName: 'Hub',
  headerMode: 'screen',
  navigationOptions: {
    headerTruncatedBackTitle: '返回',
    headerStyle: {
      backgroundColor: topBarBgColor
    },
    headerTintColor: '#ffffff'
  }
})
