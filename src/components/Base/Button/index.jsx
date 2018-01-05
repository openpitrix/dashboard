import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Button } from 'reactstrap';
import styles from './index.scss';

export default class PiButton extends PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    block: PropTypes.bool,
    color: PropTypes.string,
    disabled: PropTypes.bool,
    tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    onClick: PropTypes.func,    
  };

  static defaultProps = {
    color: 'secondary'
  };  

  render() {
    const { color, children } = this.props;

    return (
      <Button
        className={classNames(styles.btn, styles[color])}
        {...this.props}
      >
        {children}
      </Button>
    );
  }
}
