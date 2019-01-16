import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import { Popper } from 'react-popper';

import styles from '../index.scss';

export default class PortalTooltip extends React.Component {
  constructor(props) {
    super(props);

    this.el = document.getElementById('root');
  }

  render() {
    const {
      children,
      popperCls,
      visible,
      placement,
      innerRef,
      onClick
    } = this.props;
    return ReactDOM.createPortal(
      <Popper
        positionFixed={false}
        onClick={onClick}
        className={classnames(styles.popper, styles.portalPopper, popperCls, {
          [styles.active]: visible
        })}
        placement={placement}
        innerRef={innerRef}
      >
        {children}
      </Popper>,
      this.el
    );
  }
}
