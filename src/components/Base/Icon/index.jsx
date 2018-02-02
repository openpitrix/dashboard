import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './index.scss';

export default class Icon extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
  }

  render() {
    const { name, ...rest } = this.props;
    const className = classnames('icon', `icon-${name}`, className);

    return (
      <i className={className} {...rest} />
    );
  }
}
