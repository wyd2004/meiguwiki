import * as React from 'react'
import {
  FlatList,
  ImageStyle,
  Linking,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'
import EntypoIcon from 'react-native-vector-icons/Entypo'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import IoniconsIcon from 'react-native-vector-icons/Ionicons'
import { NavigationScreenConfig, NavigationTabScreenOptions } from 'react-navigation'
import * as colors from '../colors'

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.topBarBgColor
  } as ViewStyle,
  list: {
    backgroundColor: colors.listContainerBgColor
  } as ViewStyle,
  listHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: colors.listSeparatorColor
  } as ViewStyle,
  listSeparator: {
    height: 1,
    backgroundColor: colors.listSeparatorColor,
    marginHorizontal: 16
  } as ViewStyle,
  listFooter: {
    height: 1,
    backgroundColor: colors.listSeparatorColor
  } as ViewStyle,
  appIcon: {
    marginBottom: 15
  } as ImageStyle,
  appTitle: {
    color: colors.mainTextColorOnLightBg,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 13
  } as TextStyle,
  appDescription: {
    color: colors.accessoryTextColorOnLightBg,
    fontSize: 12,
    marginVertical: 3
  } as TextStyle,
  listItemContainer: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center'
  } as ViewStyle,
  listItemText: {
    color: colors.mainTextColorOnLightBg,
    fontSize: 16,
    flexGrow: 1
  } as TextStyle
})

interface ILink {
  title: string
  url: string
}

class ListCell extends React.Component<ILink> {
  onPress = async () => {
    await Linking.openURL(this.props.url)
  }
  render () {
    return (
      <TouchableOpacity style={styles.listItemContainer} onPress={this.onPress}>
        <Text style={styles.listItemText}>{this.props.title}</Text>
        <EntypoIcon name="chevron-thin-right" size={20} color={colors.listArrowColor} />
      </TouchableOpacity>
    )
  }
}

// TODO: 替换占位链接
const links: ILink[] = [{
  title: '美股开户',
  url: 'http://meiguwiki.com/'
}, {
  title: '区块链开户',
  url: 'http://meiguwiki.com/'
}, {
  title: '联系我们',
  url: 'http://meiguwiki.com/'
}, {
  title: '声明条款',
  url: 'http://meiguwiki.com/'
}]

export class About extends React.Component {
  static navigationOptions: NavigationScreenConfig<NavigationTabScreenOptions> = {
    tabBarLabel: '关于',
    tabBarIcon ({ focused, tintColor }) {
      return <FAIcon name="user-circle-o" size={20} color={tintColor} />
    }
  }
  renderListItem: ListRenderItem<ILink> = ({ item }) => <ListCell {...item} />
  renderListSeparator = () => {
    return <View style={styles.listSeparator} />
  }
  listKeyExtractor = (item: ILink) => item.title
  render () {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.list}
          ListHeaderComponent={<View style={styles.listHeader}>
              <IoniconsIcon
                style={styles.appIcon}
                name="ios-appstore-outline"
                size={70}
                color={colors.highlightTextColor}
              />
              <Text style={styles.appTitle}>美股维基百科</Text>
              <Text style={styles.appDescription}>最懂区块链的美股平台</Text>
              <Text style={styles.appDescription}>精心荟萃全方位的资讯和文章</Text>
              <Text style={styles.appDescription}>一切尽在掌握</Text>
            </View>}
          ListFooterComponent={<View style={styles.listFooter} />}
          ItemSeparatorComponent={this.renderListSeparator}
          data={links}
          renderItem={this.renderListItem}
          keyExtractor={this.listKeyExtractor}
        />
      </SafeAreaView>
    )
  }
}
