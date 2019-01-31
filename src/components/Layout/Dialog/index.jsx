import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Modal } from 'components/Base';

import { getFormData } from 'utils';

import styles from './index.scss';

export default class Dialog extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    noActions: PropTypes.bool,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    title: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    wrapCls: PropTypes.string
  };

  static defaultProps = {
    width: 500,
    noActions: false
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(e, getFormData(this.form));
  };

  render() {
    const {
      width,
      title,
      isOpen,
      onCancel,
      children,
      className,
      noActions,
      wrapCls,
      ...rest
    } = this.props;

    return (
      <Modal
        width={width}
        title={title}
        visible={isOpen}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        isDialog
        hideFooter={noActions}
        className={classnames(styles.modal, className)}
        {...rest}
      >
        <div className={styles.content}>
          <form
            method="post"
            className={wrapCls}
            ref={node => {
              this.form = node;
            }}
            onSubmit={e => {
              e.preventDefault();
            }}
          >
            {children}
          </form>
        </div>
      </Modal>
    );
  }
}
