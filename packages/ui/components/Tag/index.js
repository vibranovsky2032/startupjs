import React, { useMemo } from 'react'
import { observer } from 'startupjs'
import propTypes from 'prop-types'
import Div from '../Div'
import Span from '../Span'
import Icon from '../Icon'
import colorToRGBA from '../../config/colorToRGBA'
import config from '../../config/rootConfig'
import './index.styl'

const { colors } = config
const ICON_PROPS = {
  size: 'xs'
}
const STATES_OPACITIES = {
  flat: {
    hoverOpacity: 0.5,
    activeOpacity: 0.25
  },
  outlined: {
    hoverOpacity: 0.05,
    activeOpacity: 0.25
  }
}

function Tag ({
  style,
  children,
  color,
  variant,
  shape,
  icon,
  rightIcon,
  iconsColor,
  textColor,
  onPress,
  onIconPress,
  onRightIconPress,
  ...props
}) {
  const _textColor = useMemo(() => colors[textColor] || textColor, [textColor])
  const _color = useMemo(() => colors[color] || color, [color])
  const _iconsColor = useMemo(() => {
    return colors[iconsColor] || iconsColor ||
      (variant === 'flat' ? colors.white : _color)
  }, [iconsColor, variant, _color])

  const [rootStyles, labelStyles] = useMemo(() => {
    let rootStyles = {}
    let labelStyles = {}

    switch (variant) {
      case 'flat':
        labelStyles.color = _textColor || colors.white
        rootStyles.backgroundColor = _color
        break
      case 'outlined':
        rootStyles.borderWidth = 1
        rootStyles.borderColor = colorToRGBA(_color, 0.5)
        labelStyles.color = _textColor || _color
        break
    }
    return [rootStyles, labelStyles]
  }, [variant, _textColor, _color])

  const iconWrapperStyle = { 'with-label': React.Children.count(children) }

  return pug`
    Div.root(
      style=[style, rootStyles]
      styleName=[color, shape]
      hoverOpacity=STATES_OPACITIES[variant].hoverOpacity
      activeOpacity=STATES_OPACITIES[variant].activeOpacity
      underlayColor=_color
      onPress=onPress
      ...props
    )
      if icon
        Div.leftIconWrapper(
          styleName=[iconWrapperStyle]
          onPress=onIconPress
        )
          Icon(icon=icon color=_iconsColor ...ICON_PROPS)
      if children
        Span.label(style=labelStyles bold size='xs')= children
      if rightIcon
        Div.rightIconWrapper(
          styleName=[iconWrapperStyle]
          onPress=onRightIconPress
        )
          Icon(icon=rightIcon color=_iconsColor ...ICON_PROPS)
  `
}

Tag.defaultProps = {
  color: 'primary',
  variant: 'flat',
  shape: 'circle'
}

Tag.propTypes = {
  style: propTypes.oneOfType([propTypes.object, propTypes.array]),
  children: propTypes.node,
  color: propTypes.string,
  textColor: propTypes.string,
  iconsColor: propTypes.string,
  variant: propTypes.oneOf(['flat', 'outlined']),
  shape: propTypes.oneOf(['circle', 'rounded'])
}

export default observer(Tag)
