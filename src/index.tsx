import * as React from 'react'
import {
  AppRegistry
} from 'react-native'
import { RootStackNavigator } from './route'

export class App extends React.Component {
  render () {
    return (
      <RootStackNavigator />
    )
  }
}

AppRegistry.registerComponent('meiguwiki', () => App)
