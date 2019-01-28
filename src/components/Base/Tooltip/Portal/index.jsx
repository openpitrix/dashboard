import React from 'react';
import ReactDOM from 'react-dom';

import { Popper } from 'react-popper';

export default class PortalTooltip extends React.Component {
  constructor(props) {
    super(props);

    this.el = document.getElementById('root');
  }

  render() {
    const {
      children, className, placement, innerRef, onClick
    } = this.props;
    return ReactDOM.createPortal(
      <Popper
        positionFixed={false}
        onClick={onClick}
        className={className}
        placement={placement}
        innerRef={innerRef}
      >
        {children}
      </Popper>,
      this.el
    );
  }
}
