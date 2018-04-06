import { observer } from 'mobx-react'
import * as React from 'react'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'
import SLIIcon from 'react-native-vector-icons/SimpleLineIcons'
import { NavigationScreenConfig, NavigationScreenProps, NavigationStackScreenOptions } from 'react-navigation'
import * as colors from '../colors'
import { EnhancedWebView } from '../components/EnhancedWebView'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { webBaseUrl } from '../config'
import { IModalShareNavParams } from '../pages/ModalShare'
import { store } from '../stores'
import { ArticleHandler, IArticle } from '../stores/ArticleStore'
import { formatTime } from '../utils'

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.contentBgColor
  } as ViewStyle,
  shareButton: {
    paddingHorizontal: 15,
    alignSelf: 'stretch',
    justifyContent: 'center'
  } as ViewStyle,
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 22,
    marginBottom: 18,
    color: colors.mainTextColorOnLightBg
  } as TextStyle,
  titleAccessoryText: {
    color: colors.accessoryTextColorOnLightBg,
    fontSize: 14,
    marginHorizontal: 15,
    marginBottom: 18
  } as TextStyle,
  separator: {
    height: 1,
    backgroundColor: colors.listSeparatorColor
  } as ViewStyle,
  webView: {
    marginBottom: 30
  } as ViewStyle
})

class ShareButton extends React.Component<IArticle & NavigationScreenProps & {
  disabled: boolean;
}> {
  onPress = () => {
    this.props.navigation.navigate('ModalShare', {
      article: this.props
    } as IModalShareNavParams)
  }
  render () {
    return (
      <TouchableOpacity disabled={this.props.disabled} style={styles.shareButton} onPress={this.onPress}>
        <SLIIcon name="share-alt" size={18} color="#ffffff" />
      </TouchableOpacity>
    )
  }
}

export interface IArticleNavParams {
  tid: number
  stubArticle?: IArticle
  fullArticle?: IArticle
}

interface IArticleProps extends NavigationScreenProps<IArticleNavParams> {}

@observer
export class Article extends React.Component<IArticleProps> {
  unmounted = true
  article: ArticleHandler
  static navigationOptions: NavigationScreenConfig<NavigationStackScreenOptions> = ({ navigation }) => {
    const params = navigation.state.params as IArticleNavParams
    return {
      title: '文章',
      headerRight: (
        <ShareButton
          navigation={navigation}
          disabled={!params.fullArticle}
          {...params.fullArticle}
        />
      )
    }
  }
  async componentWillMount () {
    this.unmounted = false
    try {
      const { tid, stubArticle } = this.props.navigation.state.params
      this.article = store.articleStore.openArticle(tid)
      await this.article.load(stubArticle)
      this.props.navigation.setParams({
        ...this.props.navigation.state.params,
        fullArticle: this.article.get()
      })
    } catch (e) {
      if (this.unmounted) return
      Alert.alert('加载失败', e instanceof Error ? e.message : '文章加载失败', [{
        text: '返回', onPress: () => this.props.navigation.goBack()
      }], {
        cancelable: false
      })
    }
  }
  componentWillUnmount () {
    this.unmounted = true
    this.article.destroy()
  }
  render () {
    const article = this.article.get()

    // tslint:disable:max-line-length
    const articleHtml = `
<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <base href="${webBaseUrl}" />
  <meta name="format-detection" content="telephone=no" />
  <title>${article.subject}</title>
  <style>
    html {
      padding: 18px 15px;
    }
    body {
      margin: 0;
      padding: 0;
      background: ${colors.contentBgColor};
      max-width: 100%;
      width: 100%;
      overflow-x: hidden;
      font-size: 16px;
      color: ${colors.mainTextColorOnLightBg};
      word-wrap: break-word;
      word-break: normal;
    }
    a {
      color: ${colors.highlightTextColor};
      text-decoration: none;
    }
    ul, ol, li, dl, dd, p, h1, h2, h3, h4, h5, h6, form, fieldset {
      margin: 4px;
      padding: 0;
    }
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  ${article.message}
</body>
</html>
`

    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.titleText}>{article.subject}</Text>
          <Text style={styles.titleAccessoryText}>{article.userName} {formatTime(article.timestamp)}</Text>
          <View style={styles.separator} />
          {article.message && <EnhancedWebView
            style={styles.webView}
            source={{ html: articleHtml, baseUrl: '' }}
          />}
        </ScrollView>
        <LoadingOverlay visible={article.loading} />
      </View>
    )
  }
}
