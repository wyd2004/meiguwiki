import { StackNavigator, TabNavigator } from 'react-navigation'
import { bottomTabActiveTintColor, bottomTabInactiveTintColor, topBarBgColor } from './colors'
import { About } from './pages/About'
import { Article } from './pages/Article'
import { News } from './pages/News'
import { Temp } from './Temp'

// tslint:disable-next-line:variable-name
export const RootStackNavigator = StackNavigator({
  Hub: {
    screen: TabNavigator({
      News: {
        screen: News,
        path: 'news'
      },
      Navigation: {
        screen: Temp,
        path: 'navigation'
      },
      Discovery: {
        screen: Temp,
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
  headerTransitionPreset: 'fade-in-place',
  navigationOptions: {
    headerTruncatedBackTitle: '返回',
    headerStyle: {
      backgroundColor: topBarBgColor
    },
    headerTintColor: '#ffffff'
  }
})
