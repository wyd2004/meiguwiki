import * as React from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ViewStyle
} from 'react-native'
import {
  NavigationRouteConfigMap,
  NavigationScreenConfig,
  NavigationScreenProps,
  NavigationTabScreenOptions,
  TabNavigator
} from 'react-navigation'
import * as colors from '../colors'
import { topTabNavigatorConfig } from '../config'
import { createArticleList } from './ArticleList'

const styles = StyleSheet.create({
  tabContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.topBarBgColor
  } as ViewStyle
})

export interface IArticleHubConfig<NavigationOptions> {
  navigationOptions?: NavigationScreenConfig<NavigationOptions>
  forums: {
    routeName: string;
    fid: number;
    label: string;
    path: string;
  }[]
}

export function createArticleHub<NavigationOptions = never> (hubConfig: IArticleHubConfig<NavigationOptions>) {
  const routeConfigMap: NavigationRouteConfigMap = {}
  for (const forum of hubConfig.forums) {
    routeConfigMap[forum.routeName] = {
      screen: createArticleList(forum.fid, true, {
        title: forum.label
      } as NavigationTabScreenOptions),
      path: forum.path
    }
  }
  // tslint:disable-next-line:variable-name
  const TopTabNavigator = TabNavigator(routeConfigMap, topTabNavigatorConfig)

  class ArticleHub extends React.Component<NavigationScreenProps> {
    static navigationOptions = hubConfig.navigationOptions
    // https://github.com/react-navigation/react-navigation/issues/3598#issuecomment-375622188
    static router = TopTabNavigator.router
    render () {
      return (
        <SafeAreaView style={styles.tabContainer}>
          <TopTabNavigator navigation={this.props.navigation} />
        </SafeAreaView>
      )
    }
  }
  return ArticleHub
}
