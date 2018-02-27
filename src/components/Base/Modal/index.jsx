import { omit } from 'lodash';
import React from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Button from '../Button';
import styles from './index.scss';

ReactModal.defaultStyles.overlay = Object.assign({}, ReactModal.defaultStyles.overlay, {
  padding: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  zIndex: 2000,
});

ReactModal.defaultStyles.content = Object.assign({},
  omit(ReactModal.defaultStyles.content, ['top', 'left', 'right', 'bottom', 'padding']),
  {
    width: 744,
    position: 'relative',
    margin: '0 auto',
  },
);

export default class Modal extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    width: PropTypes.number,
    visible: PropTypes.bool,
    okText: PropTypes.string,
    cancelText: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    children: PropTypes.any,
    closable: PropTypes.bool,
    hideHeader: PropTypes.bool,
    hideFooter: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    width: 600,
    visible: false,
    closable: true,
    onOk() {},
    onCancel() {},
  }

  render() {
    const { className, title, width, visible, children, hideHeader, hideFooter,
      onOk, onCancel, okText, cancelText, closable } = this.props;
    const style = { content: { width } };

    return (
      <ReactModal
        className={classnames(styles.modal, className)}
        style={style}
        isOpen={visible}
        onRequestClose={onCancel}
        ariaHideApp={false}
      >
        {
          !hideHeader &&
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>
            {closable && <i className="fa fa-times" onClick={onCancel}/>}
          </div>
        }
        <div className={styles.body}>
          {children}
        </div>
        {
          !hideFooter &&
          <div className={styles.footer}>
            <Button type="primary" onClick={onOk}>{okText || '提交'}</Button>
            <Button type="default" onClick={onCancel}>{cancelText || '取消'}</Button>
          </div>
        }
      </ReactModal>
    );
  }
}
