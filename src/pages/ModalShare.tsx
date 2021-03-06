import { observable, runInAction } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'
import {
  Clipboard,
  Image,
  ImageStyle,
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'
import Toast from 'react-native-root-toast'
import * as WeChat from 'react-native-wechat'
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource'
import { NavigationScreenProps } from 'react-navigation'
import * as colors from '../colors'
import { TouchableItem } from '../components/TouchableItem'
import { IArticle } from '../stores/ArticleStore'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.contentBgColor,
    alignItems: 'center',
    paddingTop: 30
  } as ViewStyle,
  backMask: Platform.select<ViewStyle>({
    ios: {
      flexGrow: 1
    },
    android: {
      flexGrow: 1,
      backgroundColor: 'rgba(0, 0, 0, .5)'
    }
  }),
  backButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 15,
    backgroundColor: colors.accessoryBgColor
  } as ViewStyle,
  largeText: {
    fontSize: 16,
    color: colors.mainTextColorOnLightBg
  } as TextStyle,
  shareButtonContainer: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 16
  } as ViewStyle,
  shareButton: {
    alignItems: 'center',
    padding: 12
  } as ViewStyle,
  shareButtonImage: {
    width: 58,
    height: 58
  } as ImageStyle,
  shareButtonText: {
    fontSize: 12,
    marginTop: 5,
    color: colors.mainTextColorOnLightBg
  } as TextStyle
})

export interface IModalShareNavParams {
  article: IArticle
}

@observer
export class ModalShare extends React.Component<NavigationScreenProps<IModalShareNavParams>> {
  @observable isWeChatInstalled = false
  async componentDidMount () {
    const isWeChatInstalled = await WeChat.isWXAppInstalled()
    runInAction(() => {
      this.isWeChatInstalled = isWeChatInstalled
    })
  }
  shareToWeChat = async (target: 'session' | 'timeline') => {
    const { subject, abstract, url } = this.props.navigation.state.params.article
    const shareOptions = {
      type: 'news',
      title: subject,
      description: abstract,
      // TODO: 使用大尺寸图片可能导致拉起微信失败，因此此处使用小尺寸图标
      thumbImage: resolveAssetSource(require('../images/app-logo-tiny.png')).uri,
      webpageUrl: url
    }
    try {
      switch (target) {
        case 'session':
          await WeChat.shareToSession(shareOptions)
          break
        case 'timeline':
          await WeChat.shareToTimeline(shareOptions)
          break
        default:
          break
      }
      Toast.show('分享成功')
    } catch (e) {
      Toast.show('分享已取消')
    }
  }
  onBackPress = () => {
    this.props.navigation.goBack()
  }
  onShareToWeChatSessionPress = async () => {
    await this.shareToWeChat('session')
  }
  onShareToWeChatTimelinePress = async () => {
    await this.shareToWeChat('timeline')
  }
  onCopyLinkPress = () => {
    Clipboard.setString(this.props.navigation.state.params.article.url)
    Toast.show('已复制链接')
  }
  onCopyContentPress = () => {
    Clipboard.setString(this.props.navigation.state.params.article.copyText)
    Toast.show('已复制内容')
  }
  render () {
    return (
      <View style={StyleSheet.absoluteFill}>
        <TouchableOpacity style={styles.backMask} onPress={this.onBackPress} />
        <View style={styles.container}>
          <Text style={styles.largeText}>分享到</Text>
          <View style={styles.shareButtonContainer}>
            {this.isWeChatInstalled &&
              <TouchableOpacity style={[styles.shareButton]} onPress={this.onShareToWeChatSessionPress}>
                <Image style={styles.shareButtonImage} source={require('../images/share-icon-wechat-session.png')} />
                <Text style={styles.shareButtonText}>微信好友</Text>
              </TouchableOpacity>
            }
            {this.isWeChatInstalled &&
              <TouchableOpacity style={styles.shareButton} onPress={this.onShareToWeChatTimelinePress}>
                <Image style={styles.shareButtonImage} source={require('../images/share-icon-wechat-timeline.png')} />
                <Text style={styles.shareButtonText}>朋友圈</Text>
              </TouchableOpacity>
            }
            <TouchableOpacity style={styles.shareButton} onPress={this.onCopyLinkPress}>
              <Image style={styles.shareButtonImage} source={require('../images/share-icon-copy-link.png')} />
              <Text style={styles.shareButtonText}>复制链接</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={this.onCopyContentPress}>
              <Image style={styles.shareButtonImage} source={require('../images/share-icon-copy-content.png')} />
              <Text style={styles.shareButtonText}>复制文字</Text>
            </TouchableOpacity>
          </View>
          <TouchableItem style={styles.backButton} onPress={this.onBackPress}>
            <Text style={styles.largeText}>取消</Text>
          </TouchableItem>
        </View>
      </View>
    )
  }
}
