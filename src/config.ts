import { TabBarTop, TabNavigatorConfig } from 'react-navigation'
import * as colors from './colors'

export const apiBaseUrl = 'http://api.meiguwiki.com/mg/api/v1.0'
export const webBaseUrl = 'http://meiguwiki.com/'
export const weChatAppId = 'wxd88c6339438b742a'
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
    accessId: 2200283597,
    accessKey: 'IR55FA6V6R8P'
  },
  android: {
    accessId: 2100283598,
    accessKey: 'A1Q76S9F3CPY'
  }
}
