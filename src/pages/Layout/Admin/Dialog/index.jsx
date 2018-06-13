import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Modal, Button } from 'components/Base';

import styles from './index.scss';

const Dialog = ({ width, title, isOpen, onCancel, onSubmit, children, className, ...rest }) => {
  return (
    <Modal
      width={width}
      title={title}
      visible={isOpen}
      hideFooter
      onCancel={onCancel}
      className={classnames(styles.modal, className)}
      {...rest}
    >
      <div className={styles.content}>
        {children}
        <div className={styles.operation}>
          <Button type="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="primary" onClick={onSubmit}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

Dialog.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func
};

Dialog.defaultProps = {
  width: 500
};

export default Dialog;
