import axios from 'axios'
import * as mobx from 'mobx'
import * as React from 'react'
import {
  Alert,
  AppRegistry,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  View
} from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import * as WeChat from 'react-native-wechat'
import XGPush from 'react-native-xinge-push'
import { statusBarBgColor } from './colors'
import { apiBaseUrl, weChatAppId, xgPushConfig } from './config'
import { RootStackNavigator } from './route'

axios.defaults.baseURL = apiBaseUrl
mobx.configure({ enforceActions: true })
const uriPrefix = 'meiguwiki://app/'

export class App extends React.Component {
  async componentDidMount () {
    // 微信 SDK
    try {
      await WeChat.registerApp(weChatAppId)
    } catch (e) {
      // ignore
    }

    SplashScreen.hide()

    // 信鸽推送
    try {
      if (Platform.OS === 'ios') { // TODO: 针对安卓临时关闭推送功能
        if (Platform.OS === 'ios') {
          XGPush.init(xgPushConfig.ios.accessId, xgPushConfig.ios.accessKey)
        } else {
          XGPush.init(xgPushConfig.android.accessId, xgPushConfig.android.accessKey)
        }
        XGPush.addEventListener('register', this.onPushRegister)
        XGPush.addEventListener('notification', this.onPushNotification)
        if (Platform.OS === 'ios') {
          XGPush.checkPermissions(permissions => {
            if (permissions.alert) {
              XGPush.register()
            } else {
              Alert.alert('启用推送通知', '建议开启推送通知，快人一步了解股票圈一手资讯', [
                { text: '了解', onPress: () => XGPush.register() }
              ], { cancelable: false })
            }
          })
        } else {
          XGPush.register()
        }
      }
    } catch (e) {
      // ignore
    }
  }
  componentWillUnmount () {
    XGPush.removeEventListener('register', this.onPushRegister)
    XGPush.removeEventListener('notification', this.onPushNotification)
  }
  onPushRegister = deviceToken => {
    XGPush.registerForXG(deviceToken)
  }
  async onPushNotification (notification) {
    if (notification.clicked) {
      const uri = notification.uri
      if (uri && await Linking.canOpenURL(uri)) await Linking.openURL(uri)
    }
  }
  render () {
    return (
      <View style={StyleSheet.absoluteFill}>
        <StatusBar barStyle="light-content" backgroundColor={statusBarBgColor} />
        <RootStackNavigator uriPrefix={uriPrefix} />
      </View>
    )
  }
}

AppRegistry.registerComponent('meiguwiki', () => App)
