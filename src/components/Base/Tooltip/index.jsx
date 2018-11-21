import React from 'react';
import { findDOMNode } from 'react-dom';
import {
  Manager, Target, Popper, Arrow
} from 'react-popper';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.scss';

export default class Tooltip extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
    isShowArrow: PropTypes.bool,
    onVisibleChange: PropTypes.func,
    placement: PropTypes.string,
    prefixCls: PropTypes.string,
    showBorder: PropTypes.bool,
    trigger: PropTypes.string,
    visible: PropTypes.bool
  };

  static defaultProps = {
    prefixCls: 'pi-tooltip',
    trigger: 'hover',
    placement: 'bottom',
    visible: false,
    showBorder: false,
    onVisibleChange() {}
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: props.visible
    };
    this.trigger = props.trigger;
  }

  showPopper = () => {
    this.setState(
      { visible: true },
      this.props.onVisibleChange(true, this.target)
    );
  };

  hidePopper = () => {
    this.setState(
      { visible: false },
      this.props.onVisibleChange(false, this.target)
    );
  };

  handleTogglePopper = e => {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    this.state.visible ? this.hidePopper() : this.showPopper();
  };

  handleDocumentClick = e => {
    const rootNode = findDOMNode(this);

    if (
      !rootNode
      || rootNode.contains(e.target)
      || !this.target
      || this.target.contains(e.target)
      || !this.popper
      || this.popper.contains(e.target)
    ) {
      return;
    }
    this.hidePopper();
  };

  bindEvent = () => {
    const target = this.target;
    const popper = this.popper;

    if (!target || !popper) return;

    if (this.trigger === 'hover') {
      target.addEventListener('mouseenter', this.showPopper);
      target.addEventListener('mouseleave', this.hidePopper);
      popper.addEventListener('mouseenter', this.showPopper);
      popper.addEventListener('mouseleave', this.hidePopper);
    } else {
      target.addEventListener('click', this.handleTogglePopper);
      document.addEventListener('click', this.handleDocumentClick);
    }
  };

  removeEvent = () => {
    const target = this.target;
    const trigger = this.trigger;

    if (!this.target) return;
    if (trigger === 'focus') {
      target.removeEventListener('focus', this.showPopper);
      target.removeEventListener('blur', this.hidePopper);
    } else if (trigger === 'click') {
      target.removeEventListener('click', this.handleTogglePopper);
      document.removeEventListener('click', this.handleDocumentClick);
    } else {
      target.removeEventListener('mouseenter', this.showPopper);
      target.removeEventListener('mouseleave', this.hidePopper);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible !== this.state.visible) {
      this.setState({ visible: nextProps.visible });
    }
  }

  componentDidMount() {
    this.bindEvent();
  }

  componentWillUnmount() {
    this.removeEvent();
  }

  render() {
    const {
      prefixCls,
      className,
      content,
      placement,
      children,
      isShowArrow,
      showBorder
    } = this.props;
    const visible = this.state.visible;

    return (
      <Manager className={classNames(styles.tooltip, className)}>
        <Target
          className={classNames(styles.target, {
            [styles.active]: visible || showBorder
          })}
          innerRef={c => {
            this.target = c;
          }}
        >
          {children}
        </Target>
        <Popper
          positionFixed={true}
          className={classNames(styles.popper, `${prefixCls}-popper`, {
            [styles.active]: visible
          })}
          placement={placement}
          innerRef={c => {
            this.popper = c;
          }}
        >
          {content}
          {isShowArrow
            && content && (
              <Arrow
                className={classNames(
                  styles.arrow,
                  `${prefixCls}-popper_arrow`
                )}
              />
          )}
        </Popper>
      </Manager>
    );
  }
}
