import * as React from 'react'
import {
  ActivityIndicator,
  FlatList,
  FlatListProperties,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'

export enum RefreshState {
  Idle,
  HeaderRefreshing,
  FooterRefreshing,
  NoMoreData,
  Failure,
  EmptyData
}

const DEBUG = false
const log = (text: string) => {
  if (DEBUG) console.log(text)
}

interface IRefreshListViewProps<TItem> extends FlatListProperties<TItem> {
  refreshState: RefreshState
  footerContainerStyle?: ViewStyle
  footerTextStyle?: ViewStyle
  // tslint:disable-next-line:no-any
  listRef?: any

  footerRefreshingText?: string
  footerFailureText?: string
  footerNoMoreDataText?: string
  footerEmptyDataText?: string
  onHeaderRefresh (refreshState: RefreshState): void
  onFooterRefresh? (refreshState: RefreshState): void
}

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 44
  },
  footerText: {
    fontSize: 14,
    color: '#555555'
  }
})

export class RefreshListView<TItem> extends React.PureComponent<IRefreshListViewProps<TItem>> {

  // tslint:disable-next-line:no-any
  static defaultProps: Partial<IRefreshListViewProps<any>> = {
    footerRefreshingText: '数据加载中…',
    footerFailureText: '点击重新加载',
    footerNoMoreDataText: '已加载全部数据',
    footerEmptyDataText: '暂时没有更多数据'
  }

  componentDidUpdate (prevProps: IRefreshListViewProps<TItem>) {
    log(`[RefreshListView]  RefreshListView componentDidUpdate ${prevProps.refreshState}`)
  }

  onHeaderRefresh = () => {
    log('[RefreshListView]  onHeaderRefresh')

    if (this.shouldStartHeaderRefreshing()) {
      log('[RefreshListView]  onHeaderRefresh')
      this.props.onHeaderRefresh(RefreshState.HeaderRefreshing)
    }
  }

  onEndReached = (info: { distanceFromEnd: number }) => {
    log(`[RefreshListView]  onEndReached ${info.distanceFromEnd}`)

    if (this.shouldStartFooterRefreshing()) {
      log('[RefreshListView]  onFooterRefresh')
      if (this.props.onFooterRefresh) {
        this.props.onFooterRefresh(RefreshState.FooterRefreshing)
      }
    }
  }

  shouldStartHeaderRefreshing = () => {
    log('[RefreshListView]  shouldStartHeaderRefreshing')

    if (this.props.refreshState === RefreshState.HeaderRefreshing) {
      return false
    }

    return true
  }

  shouldStartFooterRefreshing = () => {
    log('[RefreshListView]  shouldStartFooterRefreshing')

    const { refreshState, data } = this.props
    if (data.length === 0) {
      return false
    }

    return refreshState === RefreshState.Idle
  }

  render () {
    log('[RefreshListView]  render')

    const { renderItem, ...rest } = this.props
    return (
      <FlatList
        ref={this.props.listRef}
        onEndReached={this.onEndReached}
        onRefresh={this.onHeaderRefresh}
        refreshing={this.props.refreshState === RefreshState.HeaderRefreshing}
        ListFooterComponent={this.renderFooter}
        onEndReachedThreshold={0.1}
        renderItem={renderItem}
        {...rest}
      />
    )
  }

  onFooterPress = () => {
    if (this.props.onFooterRefresh) {
      this.props.onFooterRefresh(RefreshState.FooterRefreshing)
    }
  }

  renderFooter = (): JSX.Element => {
    const footerContainerStyle = [styles.footerContainer, this.props.footerContainerStyle]
    const footerTextStyle = [styles.footerText, this.props.footerTextStyle]
    const { footerRefreshingText, footerFailureText, footerNoMoreDataText, footerEmptyDataText } = this.props

    switch (this.props.refreshState) {
      case RefreshState.Idle:
        return <View style={footerContainerStyle} />
      case RefreshState.Failure:
        return (
          <TouchableOpacity
            style={footerContainerStyle}
            onPress={this.onFooterPress}
          >
            <Text style={footerTextStyle}>{footerFailureText}</Text>
          </TouchableOpacity>
        )
      case RefreshState.EmptyData:
        return (
          <TouchableOpacity
            style={footerContainerStyle}
            onPress={this.onFooterPress}
          >
            <Text style={footerTextStyle}>{footerEmptyDataText}</Text>
          </TouchableOpacity>
        )
      case RefreshState.FooterRefreshing:
        return (
          <View style={footerContainerStyle} >
            <ActivityIndicator size="small" color="#888888" />
            <Text style={[footerTextStyle, { marginLeft: 7 }]}>{footerRefreshingText}</Text>
          </View>
        )
      case RefreshState.NoMoreData:
        return (
          <View style={footerContainerStyle} >
            <Text style={footerTextStyle}>{footerNoMoreDataText}</Text>
          </View>
        )
      default:
        // tslint:disable-next-line:no-null-keyword
        return null
    }
  }
}
