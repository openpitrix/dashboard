import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon, Popover } from 'components/Base';

import styles from './index.scss';

export default class PopoverIcon extends Component {
  static propTypes = {
    className: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
    icon: PropTypes.string,
    iconCls: PropTypes.string,
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.element
    ]),
    placement: PropTypes.string,
    size: PropTypes.oneOf(['Large', 'Normal', 'Small'])
  };

  static defaultProps = {
    icon: 'more',
    iconType: 'dark',
    placement: 'bottom-end',
    size: 'Normal',
    absolute: true
  };

  state = {
    visible: false
  };

  onVisibleChange = visible => {
    this.setState({ visible });
  };

  render() {
    const {
      className,
      content,
      size,
      name,
      icon,
      iconType,
      iconCls,
      targetCls,
      popperCls,
      ...props
    } = this.props;

    return (
      <Popover
        className={classnames(
          styles.container,
          {
            [styles.visible]: this.state.visible
          },
          className
        )}
        content={content}
        onVisibleChange={this.onVisibleChange}
        targetCls={classnames(
          styles.target,
          {
            [styles.visible]: this.state.visible
          },
          styles[`target${size}`],
          targetCls
        )}
        popperCls={classnames(styles.popover, popperCls)}
        {...props}
      >
        {name}
        <Icon
          name={icon}
          className={classnames(
            styles.icon,
            {
              [styles.iconNormal]: size === 'normal',
              [styles.iconSmall]: size === 'small'
            },
            targetCls
          )}
          type={iconType}
        />
      </Popover>
    );
  }
}
