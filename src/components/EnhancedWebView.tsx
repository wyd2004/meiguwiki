import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'
import {
  Linking,
  NativeSyntheticEvent,
  WebView,
  WebViewHtmlSource,
  WebViewIOSLoadRequestEvent,
  WebViewMessageEventData,
  WebViewProps
} from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { IWebBrowserNavParams } from '../pages/WebBrowser'

const patchPostMessageFunction = () => {
  const originalPostMessage = window.postMessage

  const patchedPostMessage = (message, targetOrigin, transfer) => {
    originalPostMessage(message, targetOrigin, transfer)
  }

  patchedPostMessage.toString = () => String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')

  window.postMessage = patchedPostMessage
}
const patchPostMessageJsCode = `(${String(patchPostMessageFunction)})()`

interface IEnhancedWebViewProps extends WebViewProps, NavigationScreenProps {
  autoHeight: boolean
  openLinkInNewPage: boolean
  initialHeight?: number
}

@observer
export class EnhancedWebView extends React.Component<IEnhancedWebViewProps> {
  @observable webViewHeight = this.props.initialHeight
  webViewRef: WebView // TODO: 等待 react-native.d.ts 修复 React.createRef 用法后改写
  @action onMessage = async (event: NativeSyntheticEvent<WebViewMessageEventData>) => {
    const [op, ...parts] = event.nativeEvent.data.split(':')
    const data = parts.join(':')
    switch (op) {
      case 'height':
        this.webViewHeight = Number(data) || 0
        break
      case 'link':
        if (data.match(/^https?:\/\//)) {
          this.props.navigation.navigate('WebBrowser', {
            url: data
          } as IWebBrowserNavParams)
        } else {
          if (await Linking.canOpenURL(data)) {
            await Linking.openURL(data)
          }
        }
        break
      case 'img':
        break
      default:
        break
    }
  }
  onShouldStartLoadWithRequest = (event: WebViewIOSLoadRequestEvent) => {
    if (!(this.props.source as WebViewHtmlSource).html && !event.url.match(/^https?:\/\//)) {
      Linking.canOpenURL(event.url).then(async canOpen => {
        if (canOpen) return Linking.openURL(event.url)
      }).catch()
      return false
    }
    return true
  }
  setWebViewRef = ref => this.webViewRef = ref
  goBack = () => {
    this.webViewRef.goBack()
  }
  render () {
    const script = `
try {
  function waitPostMessageReady () {
    var isReactNativePostMessageReady = window.postMessage.length === 1;
    var queue = [];
    var currentPostMessageFn = function store(message) {
      queue.push(message);
    };
    if (!isReactNativePostMessageReady) {
      Object.defineProperty(window, "postMessage", {
        configurable: true,
        enumerable: true,
        get() {
          return currentPostMessageFn;
        },
        set(fn) {
          currentPostMessageFn = fn;
          isReactNativePostMessageReady = true;
          setTimeout(sendQueue, 0);
        }
      });
    }

    function sendQueue () {
      while (queue.length > 0) window.postMessage(queue.shift());
    }
  }
  waitPostMessageReady();
  ${this.props.openLinkInNewPage && `document.body.addEventListener('click', function (e) {
    e && e.preventDefault();
    var node = e.target;
    while (node) {
      var tagName = node.tagName.toUpperCase();
      if (tagName === 'A' && node.href) {
        window.postMessage('link:' + node.href);
        return;
      } else if (tagName === 'IMG' && node.src) {
        window.postMessage('img:' + node.src);
        return;
      } else {
        node=node.parentNode
      }
    }
    return;
  }, true)`};
  function postHeight () {
    var height = document.documentElement.offsetHeight;
    ${this.props.autoHeight && 'window.postMessage(\'height:\' + height)'};
  }
  window.addEventListener('DOMContentLoaded', postHeight);
  window.addEventListener('load', postHeight);
  window.addEventListener('resize', postHeight);
  setTimeout(postHeight, 0);
  setTimeout(postHeight, 300);
} catch (error) {
  document.write(error);
}
${patchPostMessageJsCode}
`
    return (
      <WebView
        {...this.props}
        ref={this.setWebViewRef}
        style={this.props.autoHeight ? [
          this.props.style,
          { height: this.webViewHeight }
        ] : this.props.style}
        injectedJavaScript={script}
        onMessage={this.onMessage}
        scrollEnabled={!this.props.autoHeight}
        bounces={!this.props.autoHeight}
        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
        dataDetectorTypes="none"
        domStorageEnabled
        javaScriptEnabled
      />
    )
  }
}
