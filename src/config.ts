import { TabBarTop, TabNavigatorConfig } from 'react-navigation'
import * as colors from './colors'

export const apiBaseUrl = 'http://198.13.52.6/mg/api/v1.0'
export const webBaseUrl = 'http://meiguwiki.com/'
export const weChatAppId = 'wx9b1808526a5e33f2'
export const topTabNavigatorConfig: TabNavigatorConfig = {
  tabBarComponent: TabBarTop,
  tabBarPosition: 'top',
  swipeEnabled: true,
  animationEnabled: true,
  lazy: false,
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
}
