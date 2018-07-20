import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isNumber, noop } from 'lodash';

import styles from './index.scss';

import svgSprite from 'assets/icons';

const prepend = (el, target) => {
  if (target.firstChild) {
    target.insertBefore(el, target.firstChild);
  } else {
    target.appendChild(el);
  }
};

const appendSvg = () => {
  const svgContainer = document.createElement('div');
  svgContainer.innerHTML = svgSprite;
  const svg = svgContainer.getElementsByTagName('svg')[0];
  if (svg) {
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.style.width = 0;
    svg.style.height = 0;
    svg.style.overflow = 'hidden';
    prepend(svg, document.body);
  }
};

// mapping icon name
const iconNameMap = {
  magnifier: 'search'
};

class Icon extends React.PureComponent {
  static propTypes = {
    prefix: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
    style: PropTypes.object,
    changeable: PropTypes.bool,
    clickable: PropTypes.bool,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    color: PropTypes.object
  };

  static defaultProps = {
    type: 'dark',
    size: 16,
    prefix: 'qicon',
    style: {},
    changeable: false,
    clickable: false,
    disabled: false,
    onClick: noop
  };

  componentWillMount() {
    if (typeof window === 'object' && !window.iconfont__svg__inject) {
      window.iconfont__svg__inject = true;
      appendSvg();
    }
  }

  render() {
    const {
      prefix,
      name,
      type,
      size,
      className,
      onClick,
      style,
      clickable,
      changeable,
      disabled,
      color
    } = this.props;

    let styles = style;
    let colorStyles = {};

    if (isNumber(size)) {
      styles = Object.assign({}, style, { width: `${size}px`, height: `${size}px` });
    }

    if (color) {
      colorStyles = {
        '--primary-color': color.primary,
        '--secondary-color': color.secondary
      };
    }

    return (
      <span
        style={styles}
        className={classNames(
          'icon',
          `icon-${iconNameMap[name] || name}`,
          {
            [`icon-is-${size}`]: !isNumber(size),
            'icon-clickable': clickable,
            'icon-changeable': changeable && !disabled,
            'icon-disabled': disabled
          },
          className
        )}
        onClick={onClick}
      >
        <svg className={`${prefix} ${prefix}-${name} ${prefix}-${type}`} style={colorStyles}>
          <use xlinkHref={`#${name}`} />
        </svg>
      </span>
    );
  }
}

export default Icon;
