import { TabBarTop, TabNavigatorConfig } from 'react-navigation'
import * as colors from './colors'

export const apiBaseUrl = 'http://api.meiguwiki.com/mg/api/v1.0'
export const webBaseUrl = 'http://meiguwiki.com/'
export const weChatAppId = ''
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
export const xgPushConfig = {
  ios: {
    accessId: 0000000,
    accessKey: ''
  },
  android: {
    accessId: 00000,
    accessKey: ''
  }
}
