import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon } from 'components/Base';

import styles from './index.scss';

export default class Image extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    iconSize: PropTypes.number,
    className: PropTypes.string
  };

  static defaultProps = {
    iconSize: 24,
    src: ''
  };

  state = {
    failed: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return Boolean(nextState.failed);
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
    const { src, className, iconSize, ...rest } = this.props;
    const { failed } = this.state;

    if (failed) {
      return (
        <Icon
          name="picture"
          type="dark"
          size={iconSize}
          data-origin-url={src}
          className={className}
          {...rest}
        />
      );
    }

    return (
      <img
        src={src}
        data-origin-url={src}
        className={classnames(styles.img, className)}
        ref={c=> this.img = c}
        {...rest}
      />
    );
  }
}
