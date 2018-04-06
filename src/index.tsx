import axios from 'axios'
import { configure } from 'mobx'
import * as React from 'react'
import {
  AppRegistry,
  Platform,
  StatusBar,
  StyleSheet,
  View
} from 'react-native'
import * as WeChat from 'react-native-wechat'
import { apiBaseUrl, weChatAppId } from './config'
import { RootStackNavigator } from './route'

axios.defaults.baseURL = apiBaseUrl
configure({ enforceActions: true })
const uriPrefix = Platform.OS === 'android' ? 'meiguwiki://app/' : 'meiguwiki://'

export class App extends React.Component {
  async componentDidMount () {
    const registerResult = await WeChat.registerApp(weChatAppId)
    console.log({
      registerResult,
      isWXAppInstalled: await WeChat.isWXAppInstalled(),
      isWXAppSupportApi: await WeChat.isWXAppSupportApi(),
      apiVersion: await WeChat.getApiVersion(),
      wxAppInstallUrl: await WeChat.getWXAppInstallUrl()
    })
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
