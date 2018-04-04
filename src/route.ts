import { StackNavigator, TabNavigator } from 'react-navigation'
import { bottomTabActiveTintColor, bottomTabInactiveTintColor } from './colors'
import { About } from './Pages/About'
import { News } from './Pages/News'
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
    screen: Temp,
    path: 'article/:tid'
  }
}, {
  initialRouteName: 'Hub'
})
