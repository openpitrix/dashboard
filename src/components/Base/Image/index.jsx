import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { startsWith } from 'lodash';

import styles from './index.scss';

export default class Image extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    iconLetter: PropTypes.string,
    iconSize: PropTypes.number,
    isBase64Str: PropTypes.bool,
    src: PropTypes.string
  };

  static defaultProps = {
    iconSize: 24,
    src: '',
    iconLetter: '',
    isBase64Str: false
  };

  state = {
    failed: false
  };

  componentDidMount() {
    this.img.onerror = () => {
      this.setState({ failed: true });
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.src !== this.props.src
      || Boolean(nextState.failed)
      || Boolean(nextProps.iconLetter)
    );
  }

  componentWillUpdate(nextProps) {
    if (nextProps.src !== this.props.src) {
      this.setState({ failed: false });
    }
  }

  componentWillUnmount() {
    if (this.img && this.img.onerror) {
      this.img.onerror = null;
    }
  }

  render() {
    const {
      src,
      iconLetter,
      className,
      iconSize,
      isBase64Str,
      ...rest
    } = this.props;
    const { failed } = this.state;

    let imgStr = src && startsWith(src, 'att-') ? `/attachments/${src}` : src;
    if (isBase64Str && !imgStr.startsWith('/attachments/')) {
      imgStr = `data:image/png;data:image/svg;data:image/jpg;base64,${src}`;
    }

    if (failed) {
      const style = {
        width: `${iconSize}px`,
        height: `${iconSize}px`
      };
      const letter = iconLetter.substr(0, 1).toLocaleUpperCase();

      if (letter) {
        const size = iconSize / 2;
        style.fontSize = `${size}px`;
        style.padding = `${iconSize / 4 - 1}px`;
        style.lineHeight = `${size > 12 ? size : 12}px`;

        return (
          <span
            className={classnames(styles.letter, className)}
            style={style}
            {...rest}
          >
            {letter}
          </span>
        );
      }
      return null;
    }

    return (
      <img
        src={imgStr}
        data-origin-url={imgStr}
        className={classnames(styles.img, className)}
        ref={c => {
          this.img = c;
        }}
        {...rest}
      />
    );
  }
}
