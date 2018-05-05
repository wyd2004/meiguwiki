import * as React from 'react'
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import {
  NavigationScreenConfig,
  NavigationScreenProps,
  NavigationTabScreenOptions,
  TabNavigator
} from 'react-navigation'
import * as colors from '../colors'
import { TouchableItem } from '../components/TouchableItem'
import { topTabNavigatorConfig } from '../config'
import { INavigationLinkListNavParams } from './NavigationLinkList'

const styles = StyleSheet.create({
  tabContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.topBarBgColor
  } as ViewStyle,
  listContainer: {
    backgroundColor: colors.listContainerBgColor
  } as ViewStyle,
  listSeparator: {
    height: 1,
    backgroundColor: colors.listSeparatorColor
  } as ViewStyle,
  listItemContainer: {
    flexDirection: 'row'
  } as ViewStyle,
  listItemTouchable: {
    alignItems: 'center',
    paddingVertical: 20,
    width: Dimensions.get('window').width / 2
  } as ViewStyle,
  listItemText: {
    fontSize: 17,
    color: colors.mainTextColorOnLightBg
  } as TextStyle,
  listItemRightBorder: {
    width: 1,
    marginVertical: 16,
    backgroundColor: colors.listSeparatorColor
  } as ViewStyle
})

interface IForum {
  fid: number
  name: string
}

class ListCell extends React.Component<IForum & NavigationScreenProps & { odd: boolean }> {
  onPress = async () => {
    this.props.navigation.navigate('NavigationLinkList', {
      fid: this.props.fid,
      forumName: this.props.name
    } as INavigationLinkListNavParams)
  }
  render () {
    const rightBorder = this.props.odd ? <View style={styles.listItemRightBorder} /> : undefined
    return (
      <View style={styles.listItemContainer}>
        <TouchableItem style={styles.listItemTouchable} onPress={this.onPress}>
          <Text style={styles.listItemText}>{this.props.name}</Text>
        </TouchableItem>
        {rightBorder}
      </View>
    )
  }
}

function createForumList (label: string, forums: IForum[]) {
  class ForumList extends React.Component<NavigationScreenProps> {
    static navigationOptions: NavigationScreenConfig<NavigationTabScreenOptions> = {
      title: label
    }
    renderItem: ListRenderItem<IForum> = ({ item, index }) => {
      return (
        <ListCell
          navigation={this.props.navigation}
          odd={index % 2 === 0}
          {...item}
        />
      )
    }
    renderListSeparator = () => {
      return <View style={styles.listSeparator} />
    }
    listKeyExtractor = (item: IForum) => item.fid.toString()
    render () {
      return (
        <FlatList
          style={styles.listContainer}
          data={forums}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderListSeparator}
          ListHeaderComponent={this.renderListSeparator}
          ListFooterComponent={this.renderListSeparator}
          numColumns={2}
          keyExtractor={this.listKeyExtractor}
        />
      )
    }
  }
  return ForumList
}

// tslint:disable-next-line:variable-name
const TopTabNavigator = TabNavigator({
  UsStock: {
    screen: createForumList('美股', [{
      fid: 8,
      name: '视频教学'
    }, {
      fid: 9,
      name: '市场数据'
    }, {
      fid: 10,
      name: '事件日期'
    }, {
      fid: 11,
      name: '交易查询'
    }, {
      fid: 12,
      name: '常用工具'
    }, {
      fid: 22,
      name: '美股资讯'
    }, {
      fid: 14,
      name: '热门社区'
    }, {
      fid: 15,
      name: '宏观数据'
    }, {
      fid: 16,
      name: '基本教学'
    }, {
      fid: 17,
      name: '美股书籍'
    }]),
    path: 'us-stock'
  },
  Blockchain: {
    screen: createForumList('区块链', [{
      fid: 33,
      name: '以太坊'
    }, {
      fid: 40,
      name: '内容版权'
    }, {
      fid: 39,
      name: '资产交易'
    }, {
      fid: 35,
      name: '协会'
    }, {
      fid: 36,
      name: '创业投资'
    }, {
      fid: 38,
      name: '峰会'
    }, {
      fid: 34,
      name: '基础设施'
    }, {
      fid: 41,
      name: '公正防伪'
    }, {
      fid: 42,
      name: '学院'
    }, {
      fid: 43,
      name: '数字货币'
    }, {
      fid: 44,
      name: 'PoS'
    }, {
      fid: 45,
      name: '比特币入门'
    }, {
      fid: 46,
      name: 'PoW'
    }, {
      fid: 47,
      name: '以太坊入门'
    }, {
      fid: 48,
      name: 'DPoS'
    }, {
      fid: 49,
      name: '资讯'
    }, {
      fid: 50,
      name: '微博'
    }, {
      fid: 51,
      name: '专家'
    }, {
      fid: 52,
      name: '媒体'
    }, {
      fid: 53,
      name: '社区'
    }, {
      fid: 54,
      name: '交易平台'
    }, {
      fid: 55,
      name: '区块查询'
    }, {
      fid: 56,
      name: '投资'
    }, {
      fid: 57,
      name: '行情'
    }, {
      fid: 58,
      name: '基金'
    }, {
      fid: 59,
      name: 'ATM'
    }, {
      fid: 60,
      name: '钱包'
    }, {
      fid: 63,
      name: '支付'
    }, {
      fid: 67,
      name: '挖矿'
    }, {
      fid: 68,
      name: '矿池'
    }, {
      fid: 69,
      name: '云算力'
    }, {
      fid: 70,
      name: '矿机'
    }, {
      fid: 72,
      name: '收益计算'
    }]),
    path: 'blockchain'
  }
}, topTabNavigatorConfig)

export class Navigation extends React.Component<NavigationScreenProps> {
  static navigationOptions: NavigationScreenConfig<NavigationTabScreenOptions> = {
    tabBarLabel: '导航',
    tabBarIcon: ({ focused, tintColor }) => <FAIcon name="th-large" size={20} color={tintColor} />
  }
  static router = TopTabNavigator.router
  render () {
    return (
      <SafeAreaView style={styles.tabContainer}>
        <TopTabNavigator navigation={this.props.navigation} />
      </SafeAreaView>
    )
  }
}
