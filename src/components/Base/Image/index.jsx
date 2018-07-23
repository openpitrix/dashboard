import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon } from 'components/Base';

import styles from './index.scss';

export default class Image extends React.Component {
  static propTypes = {
    src: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
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
    const { src, className, ...rest } = this.props;
    const { failed } = this.state;

    if (failed) {
      return <Icon name="picture" size={24} type="dark" data-origin-url={src} />;
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
