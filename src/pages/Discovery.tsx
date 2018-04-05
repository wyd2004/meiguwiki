import * as React from 'react'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import { NavigationTabScreenOptions } from 'react-navigation'
import { createArticleHub } from '../components/ArticleHub'

// tslint:disable-next-line:variable-name
export const Discovery = createArticleHub({
  navigationOptions: {
    tabBarLabel: '发现',
    tabBarIcon: ({ focused, tintColor }) => <FAIcon name="safari" size={20} color={tintColor} />
  } as NavigationTabScreenOptions,
  forums: [{
    routeName: 'StockCoinTalk',
    fid: 1,
    label: '谈股论币',
    path: 'stock-coin-talk'
  }, {
    routeName: 'UsStockWeekly',
    fid: 2,
    label: '美股周报',
    path: 'us-stock-weekly'
  }, {
    routeName: 'StudyArchive',
    fid: 3,
    label: '学习存档',
    path: 'study-archive'
  }]
})
