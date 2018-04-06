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
import { apiBaseUrl } from './config'
import { RootStackNavigator } from './route'

axios.defaults.baseURL = apiBaseUrl
configure({ enforceActions: true })
const uriPrefix = Platform.OS === 'android' ? 'meiguwiki://app/' : 'meiguwiki://'

export class App extends React.Component {
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
