import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon } from 'components/Base';

import styles from './index.scss';

export default class Image extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    iconLetter: PropTypes.string,
    iconSize: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    iconSize: 24,
    src: '',
    iconLetter: ''
  };

  state = {
    failed: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.src !== this.props.src || Boolean(nextState.failed);
  }

  componentDidMount() {
    this.img.onerror = () => {
      this.setState({ failed: true });
    };
  }

  componentWillUnmount() {
    if (this.img && this.img.onerror) {
      this.img.onerror = null;
    }
  }

  render() {
    const { src, iconLetter, className, iconSize, ...rest } = this.props;
    const { failed } = this.state;

    if (failed) {
      const nonIcon = '/none.svg';
      const style = {
        width: iconSize + 'px',
        height: iconSize + 'px'
      };
      const letter = iconLetter.substr(0, 1).toLocaleUpperCase();

      if (letter) {
        style.fontSize = iconSize / 2 + 'px';
        style.padding = iconSize / 4 - 1 + 'px';
        return (
          <span className={classnames(styles.letter, className)} style={style} {...rest}>
            {letter}
          </span>
        );
      }

      return (
        <img
          src={nonIcon}
          data-origin-url={src}
          style={style}
          className={classnames(styles.img, className)}
          {...rest}
        />
      );
    }

    return (
      <img
        src={src}
        data-origin-url={src}
        className={classnames(styles.img, className)}
        ref={c => (this.img = c)}
        {...rest}
      />
    );
  }
}
