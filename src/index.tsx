import axios from 'axios'
import * as React from 'react'
import {
  AppRegistry,
  StatusBar,
  StyleSheet,
  View
} from 'react-native'
import { apiBaseUrl } from './config'
import { RootStackNavigator } from './route'

axios.defaults.baseURL = apiBaseUrl

export class App extends React.Component {
  render () {
    return (
      <View style={StyleSheet.absoluteFill}>
        <StatusBar barStyle="light-content" />
        <RootStackNavigator />
      </View>
    )
  }
}

AppRegistry.registerComponent('meiguwiki', () => App)
