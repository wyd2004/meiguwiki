import { observer } from 'mobx-react'
import * as React from 'react'
import { NavigationScreenConfig, NavigationScreenProps, NavigationStackScreenOptions } from 'react-navigation'
import { createArticleList } from '../components/ArticleList'

export interface INavigationLinkListNavParams {
  fid: number
  forumName?: string
}

@observer
export class NavigationLinkList extends React.Component<NavigationScreenProps<INavigationLinkListNavParams>> {
  static navigationOptions: NavigationScreenConfig<NavigationStackScreenOptions> = ({ navigation }) => {
    const params = navigation.state.params as INavigationLinkListNavParams
    return {
      title: params.forumName
    }
  }
  render () {
    const { fid } = this.props.navigation.state.params
    // tslint:disable-next-line:variable-name
    const ArticleList = createArticleList(fid)
    return <ArticleList navigation={this.props.navigation} jumpMode />
  }
}
