import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Button } from 'reactstrap';
import styles from './index.scss';

export default class PiButton extends PureComponent {
  static defaultProps = {
    type: 'default'
  };

  static propTypes = {
    active: PropTypes.bool,
    block: PropTypes.bool,
    color: PropTypes.string,
    disabled: PropTypes.bool,
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    onClick: PropTypes.func,
    size: PropTypes.string,
    type: PropTypes.string,        
  };

  render() {
    const { type, children } = this.props;

    let cx = classNames.bind(styles);
    let classes = cx('btn', {
      [`btn-${type}`]: type
    });

    return (
      <Button
        className={classes}
        {...this.props}
      >
        {children}
      </Button>
    );
  }
}
