import * as React from 'react'
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'

const instructions = Platform.select({
  ios: `Press Cmd+R to reload,
Cmd+D or shake for dev menu`,
  android: `Double tap R on your keyboard to reload,
Shake or press menu button for dev menu`
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
})

let counter = 0

export class Temp extends React.Component<NavigationInjectedProps> {
  static navigationOptions = {
    title: 'Temp'
  }
  componentWillMount () {
    counter++
  }
  openArticle = () => {
    this.props.navigation.navigate('Article', {
      tid: 4109
    })
  }
  render () {
    return (
      <View style={styles.container}>
        <Button title="文章页" color="#57bae8" onPress={this.openArticle} />
        <Text style={styles.welcome}>
          Welcome to React Native! {counter}
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    )
  }
}
