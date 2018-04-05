import { observer } from 'mobx-react'
import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { createArticleList } from '../components/ArticleList'

export interface INavigationLinkListNavParams {
  fid: number
}

@observer
export class NavigationLinkList extends React.Component<NavigationScreenProps<INavigationLinkListNavParams>> {
  render () {
    const { fid } = this.props.navigation.state.params
    // tslint:disable-next-line:variable-name
    const ArticleList = createArticleList(fid)
    return <ArticleList navigation={this.props.navigation} jumpMode />
  }
}
