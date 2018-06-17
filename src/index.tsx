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
import { sleep } from './utils'

axios.defaults.baseURL = apiBaseUrl
mobx.configure({ enforceActions: true })
const uriPrefix = 'meiguwiki://app/'

export class App extends React.Component {
  async componentDidMount () {
    if (Platform.OS === 'android') await sleep(2000)
    SplashScreen.hide()

    // 微信 SDK
    try {
      await WeChat.registerApp(weChatAppId)
    } catch (e) {
      // ignore
    }

    // 信鸽推送
    try {
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
        const initialNotification = await XGPush.getInitialNotification()
        await this.openNotificationTargetUri(initialNotification)
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
    console.log(`XG Device Token: ${deviceToken}`)
  }
  onPushNotification = async notification => {
    if (notification.clicked) {
      await this.openNotificationTargetUri(notification)
    }
  }
  async openNotificationTargetUri (notification) {
    try {
      const uri = Platform.OS === 'ios' ? notification.uri : JSON.parse(notification.custom_content).uri
      if (uri && await Linking.canOpenURL(uri)) await Linking.openURL(uri)
    } catch (e) {
      // ignore
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
