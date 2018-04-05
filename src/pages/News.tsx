import * as React from 'react'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import { NavigationTabScreenOptions } from 'react-navigation'
import { createArticleHub } from '../components/ArticleHub'

// tslint:disable-next-line:variable-name
export const News = createArticleHub({
  navigationOptions: {
    tabBarLabel: '资讯',
    tabBarIcon: ({ focused, tintColor }) => <FAIcon name="newspaper-o" size={20} color={tintColor} />
  } as NavigationTabScreenOptions,
  forums: [{
    routeName: 'HotNews',
    fid: 21,
    label: '热点新闻',
    path: 'hot-news'
  }, {
    routeName: 'Chinese7x24',
    fid: 5,
    label: '7x24 中文',
    path: 'chinese-7x24'
  }, {
    routeName: 'Blockchain7x24',
    fid: 23,
    label: '7x24 区块链',
    path: 'blockchain-7x24'
  }, {
    routeName: 'English7x24',
    fid: 6,
    label: '7x24 英文',
    path: 'english-7x24'
  }]
})
