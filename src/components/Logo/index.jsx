import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class Logo extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    url: PropTypes.string,
  };

  render() {
    const { className, url } = this.props;
    return (
      <Link to="/" className={className}>
        <img src={url} alt="logo" height="100%"/>
      </Link>
    );
  }
}
