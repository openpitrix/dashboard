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

  constructor(props) {
    super(props);
    this.imgRef = new React.createRef();
  }

  state = {
    failed: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return Boolean(nextState.failed);
  }

  componentDidMount() {
    this.imgRef.current.onerror = () => {
      this.setState({ failed: true });
    };
  }

  componentWillUnmount() {
    if (this.imgRef && this.imgRef.current) {
      this.imgRef.current.onerror = null;
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
        ref={this.imgRef}
        {...rest}
      />
    );
  }
}
