import * as React from 'react'
import {
  Clipboard,
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'
import Toast from 'react-native-root-toast'
import * as WeChat from 'react-native-wechat'
import { NavigationScreenProps } from 'react-navigation'
import * as colors from '../colors'
import { IArticle } from '../stores/ArticleStore'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.contentBgColor,
    alignItems: 'center',
    paddingTop: 30
  } as ViewStyle,
  backMask: {
    flexGrow: 1
  } as ViewStyle,
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

export class ModalShare extends React.Component<NavigationScreenProps<IModalShareNavParams>> {
  onBackPress = () => {
    this.props.navigation.goBack()
  }
  onShareToWeChatPress = async () => {
    await WeChat.shareToTimeline({
      type: 'text',
      description: 'hello, wechat'
    })
  }
  onShareToWeChatMomentsPress = async () => {
    await WeChat.shareToSession({
      type: 'text',
      description: 'hello, wechat'
    })
  }
  onCopyLinkPress = () => {
    Clipboard.setString(this.props.navigation.state.params.article.url)
    Toast.show('已复制链接')
  }
  render () {
    return (
      <View style={StyleSheet.absoluteFill}>
        <TouchableOpacity style={styles.backMask} onPress={this.onBackPress} />
        <View style={styles.container}>
          <Text style={styles.largeText}>分享到</Text>
          <View style={styles.shareButtonContainer}>
            <TouchableOpacity style={styles.shareButton} onPress={this.onShareToWeChatPress}>
              <Image style={styles.shareButtonImage} source={require('../images/share-icon-wechat.png')} />
              <Text style={styles.shareButtonText}>微信好友</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={this.onShareToWeChatMomentsPress}>
              <Image style={styles.shareButtonImage} source={require('../images/share-icon-wechat-moments.png')} />
              <Text style={styles.shareButtonText}>朋友圈</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={this.onCopyLinkPress}>
              <Image style={styles.shareButtonImage} source={require('../images/share-icon-copy-link.png')} />
              <Text style={styles.shareButtonText}>复制链接</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.backButton} onPress={this.onBackPress}>
            <Text style={styles.largeText}>取消</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
