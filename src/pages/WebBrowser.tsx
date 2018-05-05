import * as React from 'react'
import {
  ActivityIndicator,
  LayoutChangeEvent,
  NavState,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native'
import {
  HeaderBackButton,
  HeaderBackButtonProps,
  NavigationScreenConfig,
  NavigationScreenProps,
  NavigationStackScreenOptions
} from 'react-navigation'
import { EnhancedWebView } from '../components/EnhancedWebView'
import { TouchableItem } from '../components/TouchableItem'

const styles = StyleSheet.create({
  webView: {
    flex: 1
  } as ViewStyle,
  backButtonsContainer: {
    flexDirection: 'row'
  } as ViewStyle,
  backButtonContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center'
  } as ViewStyle,
  backButtonTitle: {
    fontSize: 17,
    paddingRight: Platform.OS === 'ios' ? 10 : 0
  } as TextStyle,
  webViewLoadingIndicator: {
    marginHorizontal: 15
  } as ViewStyle
})

export interface IWebBrowserNavParams {
  encodedUrl?: string
  url?: string,
  title?: string
  canWebViewGoBack?: boolean
  closeButtonWidth?: number
  webViewRef?: EnhancedWebView
  loading?: boolean
}

interface IWebBrowserProps extends NavigationScreenProps<IWebBrowserNavParams> {}

export class WebBrowser extends React.Component<IWebBrowserProps> {
  webViewRef = React.createRef<EnhancedWebView>()
  constructor (props: IWebBrowserProps) {
    super(props)
    const { encodedUrl } = props.navigation.state.params
    if (encodedUrl) {
      props.navigation.setParams({ url: decodeURIComponent(encodedUrl) })
    }
  }
  static navigationOptions: NavigationScreenConfig<NavigationStackScreenOptions> = ({ navigation }) => {
    const params = navigation.state.params as IWebBrowserNavParams

    class BackButton extends React.Component<HeaderBackButtonProps> {
      goBack = () => {
        if (params.canWebViewGoBack) {
          params.webViewRef.goBack()
        } else {
          this.props.onPress()
        }
      }
      close = () => {
        this.props.onPress()
      }
      onCloseButtonLayout = (event: LayoutChangeEvent) => {
        if (!params.closeButtonWidth) {
          navigation.setParams({ closeButtonWidth: event.nativeEvent.layout.width } as IWebBrowserNavParams)
        }
      }
      render () {
        return (
          <View style={styles.backButtonsContainer}>
            <HeaderBackButton {...this.props} title="返回" onPress={this.goBack} />
            {params.canWebViewGoBack && <TouchableItem
              delayPressIn={0}
              onPress={this.close}
              pressColor={this.props.pressColorAndroid}
              style={styles.backButtonContainer}
              borderless
            >
              <View style={styles.backButtonContainer} onLayout={this.onCloseButtonLayout}>
                <Text
                  style={[
                    styles.backButtonTitle,
                    !!this.props.tintColor && { color: this.props.tintColor },
                    this.props.titleStyle
                  ]}
                  numberOfLines={1}
                >
                  关闭
                </Text>
              </View>
            </TouchableItem>}
          </View>
        )
      }
    }

    return {
      title: params.title,
      // tslint:disable-next-line:no-any
      headerLeft: BackButton as any,
      headerTitleStyle: {
        marginLeft: (params.canWebViewGoBack ? params.closeButtonWidth : 0) + 16
      },
      headerRight: params.loading
        && <ActivityIndicator style={styles.webViewLoadingIndicator} size="small" color="white" />
    }
  }
  onNavigationStateChange = (navState: NavState) => {
    this.props.navigation.setParams({
      title: navState.title,
      canWebViewGoBack: navState.canGoBack
    })
  }
  onLoadStart = event => {
    const navState: NavState = event.nativeEvent
    // TODO: window.postMessage 也会触发 onLoadStart 事件，疑是 React Native 的 bug，此处判断 URL 前缀来过滤
    if (navState.url.match(/^https?:\/\//)) {
      this.props.navigation.setParams({ loading: true })
    }
  }
  onLoadEnd = event => {
    const navState: NavState = event.nativeEvent
    if (navState.url.match(/^https?:\/\//)) {
      this.props.navigation.setParams({ loading: false })
    }
  }
  setWebViewRef = ref => this.props.navigation.setParams({ webViewRef: ref })
  render () {
    return (
      <EnhancedWebView
        ref={this.setWebViewRef}
        autoHeight={false}
        openLinkInNewPage={false}
        navigation={this.props.navigation}
        style={styles.webView}
        source={{ uri: this.props.navigation.state.params.url }}
        onNavigationStateChange={this.onNavigationStateChange}
        onLoadStart={this.onLoadStart}
        onLoadEnd={this.onLoadEnd}
      />
    )
  }
}
