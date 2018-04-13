import { StackNavigator, StackNavigatorConfig, TabNavigator } from 'react-navigation'
import { bottomTabActiveTintColor, bottomTabInactiveTintColor, topBarBgColor } from './colors'
import { About } from './pages/About'
import { Article } from './pages/Article'
import { Discovery } from './pages/Discovery'
import { ModalShare } from './pages/ModalShare'
import { Navigation } from './pages/Navigation'
import { NavigationLinkList } from './pages/NavigationLinkList'
import { News } from './pages/News'
import { WebBrowser } from './pages/WebBrowser'
import { forVertical } from './utils/ScreenInterpolators'

const modalStackConfig: StackNavigatorConfig = {
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
}

// tslint:disable-next-line:variable-name
export const RootStackNavigator = StackNavigator({
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
  ArticleStack: {
    screen: StackNavigator({
      Article: {
        screen: Article,
        path: ':tid'
      },
      ModalShare: {
        screen: ModalShare
      }
    }, modalStackConfig),
    path: 'article'
  },
  NavigationLinkList: {
    screen: NavigationLinkList,
    path: 'navigation/:fid'
  },
  WebBrowser: {
    screen: WebBrowser,
    path: 'web-browser/:encodedUrl'
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
})
