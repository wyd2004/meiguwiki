import { StackNavigator, TabNavigator } from 'react-navigation'
import { bottomTabActiveTintColor, bottomTabInactiveTintColor, topBarBgColor } from './colors'
import { About } from './pages/About'
import { Article } from './pages/Article'
import { Discovery } from './pages/Discovery'
import { ModalShare } from './pages/ModalShare'
import { Navigation } from './pages/Navigation'
import { NavigationLinkList } from './pages/NavigationLinkList'
import { News } from './pages/News'
import { forVertical } from './utils/ScreenInterpolators'

// tslint:disable-next-line:variable-name
export const RootStackNavigator = StackNavigator({
  Main: StackNavigator({
    Hub: {
      screen: TabNavigator({
        News: {
          screen: News,
          path: 'news'
        },
        Navigation: {
          screen: Navigation,
          path: 'navigation'
        },
        Discovery: {
          screen: Discovery,
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
    },
    NavigationLinkList: {
      screen: NavigationLinkList,
      path: 'navigation/:fid'
    }
  }, {
    headerMode: 'screen',
    navigationOptions: {
      headerTruncatedBackTitle: '返回',
      headerStyle: {
        backgroundColor: topBarBgColor
      },
      headerTintColor: '#ffffff'
    }
  }),
  ModalShare: {
    screen: ModalShare
  }
}, {
  mode: 'modal',
  headerMode: 'none',
  cardStyle: {
    backgroundColor: 'transparent',
    shadowOpacity: 0
  },
  navigationOptions: {
    gesturesEnabled: false
  },
  transitionConfig: () => {
    return {
      screenInterpolator: forVertical
    }
  }
})
