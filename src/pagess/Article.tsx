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
import { store } from '../stores'
import { IArticle } from '../stores/ArticleStore'

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.contentBgColor
  } as ViewStyle,
  shareButton: {
    padding: 10,
    paddingRight: 15
  } as ViewStyle,
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginTop: 22,
    marginBottom: 18
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

class ShareButton extends React.Component<{
  tid: number;
  subject?: string;
}> {
  render () {
    return (
      <TouchableOpacity
        style={styles.shareButton}
        {...this.props}
      >
        <SLIIcon name="share-alt" size={20} color="#ffffff" />
      </TouchableOpacity>
    )
  }
}

interface INavParams {
  tid: number
  stubArticle?: IArticle
}

@observer
export class Article extends React.Component<NavigationScreenProps<INavParams>> {
  unmounted = true
  static navigationOptions: NavigationScreenConfig<NavigationStackScreenOptions> = ({ navigation }) => {
    const params = navigation.state.params as INavParams
    return {
      headerRight: (
        <ShareButton
          tid={params.tid}
          subject={params.stubArticle && params.stubArticle.subject}
        />
      )
    }
  }
  async componentWillMount () {
    this.unmounted = false
    try {
      const { tid, stubArticle } = this.props.navigation.state.params
      await store.articleStore.fetchArticle(tid, stubArticle)
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
    const { tid } = this.props.navigation.state.params
    store.articleStore.unloadArticle(tid)
  }
  render () {
    const { tid } = this.props.navigation.state.params
    const article = store.articleStore.articles[tid]

    // tslint:disable:max-line-length
    const articleHtml = `
<!DOCTYPE html>
<html lang="zh-cn">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <base href="http://meiguwiki.com/" />
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
        <LoadingOverlay visible={article.loading} />
        <ScrollView>
          <Text style={styles.titleText}>{article.subject}</Text>
          <Text style={styles.titleAccessoryText}>{article.userName} {article.dateTime}</Text>
          <View style={styles.separator} />
          {article.message && <EnhancedWebView
            style={styles.webView}
            source={{ html: articleHtml, baseUrl: '' }}
          />}
        </ScrollView>
      </View>
    )
  }
}
