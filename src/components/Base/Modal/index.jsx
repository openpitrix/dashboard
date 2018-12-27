import { omit } from 'lodash';
import React from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import Icon from '../Icon';
import Button from '../Button';
import styles from './index.scss';

ReactModal.defaultStyles.overlay = Object.assign(
  {},
  ReactModal.defaultStyles.overlay,
  {
    padding: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 2000
  }
);

ReactModal.defaultStyles.content = Object.assign(
  {},
  omit(ReactModal.defaultStyles.content, [
    'top',
    'left',
    'right',
    'bottom',
    'padding'
  ]),
  {
    width: 744,
    position: 'relative',
    margin: '0 auto'
  }
);

@translate()
export default class Modal extends React.Component {
  static propTypes = {
    btnType: PropTypes.string,
    cancelText: PropTypes.string,
    children: PropTypes.any,
    className: PropTypes.string,
    closable: PropTypes.bool,
    hideFooter: PropTypes.bool,
    hideHeader: PropTypes.bool,
    isDialog: PropTypes.bool,
    okText: PropTypes.string,
    onCancel: PropTypes.func,
    onOk: PropTypes.func,
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    visible: PropTypes.bool,
    width: PropTypes.number
  };

  static defaultProps = {
    className: '',
    width: 744,
    hideHeader: false,
    visible: false,
    closable: true,
    isDialog: false,
    onOk() {},
    onCancel() {},
    btnType: 'primary'
  };

  render() {
    const {
      className,
      title,
      width,
      visible,
      children,
      hideHeader,
      hideFooter,
      onOk,
      onCancel,
      okText,
      cancelText,
      closable,
      isDialog,
      btnType,
      t
    } = this.props;
    const style = { content: { width } };

    return (
      <ReactModal
        className={classnames(styles.modal, className)}
        style={style}
        isOpen={visible}
        onRequestClose={onCancel}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}
      >
        {!hideHeader && (
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>
            {closable && <Icon name="close" size={36} onClick={onCancel} />}
          </div>
        )}
        <div className={styles.body}>{children}</div>
        {!hideFooter && (
          <div className={styles.footer}>
            <div className={classnames({ [styles.operationBtn]: !isDialog })}>
              <Button type={btnType} onClick={onOk}>
                {okText || t('Confirm')}
              </Button>
              <Button type="default" onClick={onCancel}>
                {cancelText || t('Cancel')}
              </Button>
            </div>
          </div>
        )}
      </ReactModal>
    );
  }
}
