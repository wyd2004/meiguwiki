import { observer } from 'mobx-react'
import * as React from 'react'
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native'

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center'
  } as ViewStyle,
  centerView: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12
  } as ViewStyle
})

@observer
export class LoadingOverlay extends React.Component<{
  visible: boolean;
}> {
  render () {
    return this.props.visible ? (
      <View style={styles.container}>
        <View style={styles.centerView}>
          <ActivityIndicator size="large" color="white" />
        </View>
      </View>
      // tslint:disable-next-line:no-null-keyword
    ) : null
  }
}
