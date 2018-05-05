/**
 * src: https://github.com/react-navigation/react-navigation/blob/master/src/views/TouchableItem.js
 *
 * TouchableItem renders a touchable that looks native on both iOS and Android.
 *
 * It provides an abstraction on top of TouchableNativeFeedback and
 * TouchableOpacity.
 *
 * On iOS you can pass the props of TouchableOpacity, on Android pass the props
 * of TouchableNativeFeedback.
 */
import * as React from 'react'
import {
  Platform,
  TouchableNativeFeedback,
  TouchableNativeFeedbackProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View
} from 'react-native'

const ANDROID_VERSION_LOLLIPOP = 21

interface ITouchableItemProps extends TouchableNativeFeedbackProps, TouchableOpacityProps {
  borderless?: boolean
  pressColor?: string
}

export class TouchableItem extends React.Component<ITouchableItemProps> {
  static defaultProps: Partial<ITouchableItemProps> = {
    borderless: false,
    pressColor: 'rgba(0, 0, 0, .32)'
  }

  render () {
    /*
     * TouchableNativeFeedback.Ripple causes a crash on old Android versions,
     * therefore only enable it on Android Lollipop and above.
     *
     * All touchables on Android should have the ripple effect according to
     * platform design guidelines.
     * We need to pass the background prop to specify a borderless ripple effect.
     */
    if (
      Platform.OS === 'android' &&
      Platform.Version >= ANDROID_VERSION_LOLLIPOP
    ) {
      const { style, ...rest } = this.props
      return (
        <TouchableNativeFeedback
          {...rest}
          background={TouchableNativeFeedback.Ripple(
            this.props.pressColor,
            this.props.borderless
          )}
        >
          <View style={style}>{this.props.children}</View>
        </TouchableNativeFeedback>
      )
    }

    return (
      <TouchableOpacity {...this.props}>{this.props.children}</TouchableOpacity>
    )
  }
}
