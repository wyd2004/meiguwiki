import * as React from 'react'
import {
  Image,
  ImageStyle,
  SafeAreaView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import { NavigationScreenConfig, NavigationScreenProps, NavigationTabScreenOptions } from 'react-navigation'
import * as colors from '../colors'
import { createArticleList } from '../components/ArticleList'

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.topBarBgColor
  } as ViewStyle,
  listHeader: {
    alignItems: 'center',
    paddingVertical: 40
  } as ViewStyle,
  appLogoContainer: {
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3
  } as ViewStyle,
  appLogo: {
    width: 70,
    height: 70,
    borderRadius: 12
  } as ImageStyle,
  appTitle: {
    color: colors.mainTextColorOnLightBg,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15
  } as TextStyle,
  appDescription: {
    color: colors.accessoryTextColorOnLightBg,
    fontSize: 12,
    marginVertical: 3
  } as TextStyle
})

export class About extends React.Component<NavigationScreenProps> {
  static navigationOptions: NavigationScreenConfig<NavigationTabScreenOptions> = {
    tabBarLabel: '关于',
    tabBarIcon ({ focused, tintColor }) {
      return <FAIcon name="user-circle-o" size={20} color={tintColor} />
    }
  }
  render () {
    // tslint:disable-next-line:variable-name
    const ArticleList = createArticleList(7, true)
    return (
      <SafeAreaView style={styles.container}>
        <ArticleList
          navigation={this.props.navigation}
          jumpMode="article-page"
          listMode="simple"
          ListHeaderComponent={<View style={styles.listHeader}>
            <View style={styles.appLogoContainer}>
              <Image source={require('../images/app-logo.png')} style={styles.appLogo} />
            </View>
            <Text style={styles.appTitle}>美股维基百科</Text>
            <Text style={styles.appDescription}>最懂区块链的美股平台</Text>
            <Text style={styles.appDescription}>精心荟萃全方位的资讯和文章</Text>
            <Text style={styles.appDescription}>一切尽在掌握</Text>
          </View>}
        />
      </SafeAreaView>
    )
  }
}
