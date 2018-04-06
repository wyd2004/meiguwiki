import { action, observable } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'
import {
  Dimensions,
  Linking,
  NativeSyntheticEvent,
  WebView,
  WebViewMessageEventData,
  WebViewProperties
} from 'react-native'

const patchPostMessageFunction = () => {
  const originalPostMessage = window.postMessage

  const patchedPostMessage = (message, targetOrigin, transfer) => {
    originalPostMessage(message, targetOrigin, transfer)
  }

  patchedPostMessage.toString = () => String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')

  window.postMessage = patchedPostMessage
}
const patchPostMessageJsCode = `(${String(patchPostMessageFunction)})()`
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
    document.body.addEventListener('click', function (e) {
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
    }, true);
    function postHeight () {
      var height = document.documentElement.offsetHeight;
      window.postMessage('height:' + height);
    }
    window.addEventListener('load', function () {
      postHeight();
    });
    window.addEventListener('resize', postHeight);
    setTimeout(postHeight, 0);
    setTimeout(postHeight, 300);
  } catch (error) {
    document.write(error);
  }
  ${patchPostMessageJsCode}
`

@observer
export class EnhancedWebView extends React.Component<WebViewProperties> {
  @observable webViewHeight = Dimensions.get('window').height
  @action onMessage = async (event: NativeSyntheticEvent<WebViewMessageEventData>) => {
    const [op, ...parts] = event.nativeEvent.data.split(':')
    const data = parts.join(':')
    switch (op) {
      case 'height':
        this.webViewHeight = Number(data) || 0
        break
      case 'link':
        if (await Linking.canOpenURL(data)) {
          await Linking.openURL(data)
        }
        break
      case 'img':
        break
      default:
        break
    }
  }
  render () {
    return (
      <WebView
        {...this.props}
        style={[
          this.props.style,
          { height: this.webViewHeight }
        ]}
        injectedJavaScript={script}
        onMessage={this.onMessage}
        scrollEnabled={false}
        bounces={false}
        dataDetectorTypes="none"
        domStorageEnabled
        javaScriptEnabled
      />
    )
  }
}
