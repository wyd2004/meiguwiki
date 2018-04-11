import axios from 'axios'
import * as mobx from 'mobx'
import * as React from 'react'
import {
  AppRegistry,
  Platform,
  StatusBar,
  StyleSheet,
  View
} from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import * as WeChat from 'react-native-wechat'
import { apiBaseUrl, weChatAppId } from './config'
import { RootStackNavigator } from './route'

axios.defaults.baseURL = apiBaseUrl
mobx.configure({ enforceActions: true })
const uriPrefix = Platform.OS === 'android' ? 'meiguwiki://app/' : 'meiguwiki://'

export class App extends React.Component {
  async componentDidMount () {
    if (Platform.OS === 'ios') SplashScreen.hide()
    await WeChat.registerApp(weChatAppId)
  }
  render () {
    return (
      <View style={StyleSheet.absoluteFill}>
        <StatusBar barStyle="light-content" />
        <RootStackNavigator uriPrefix={uriPrefix} />
      </View>
    )
  }
}

AppRegistry.registerComponent('meiguwiki', () => App)
