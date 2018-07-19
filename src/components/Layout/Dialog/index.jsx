import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Modal, Button } from 'components/Base';

import styles from './index.scss';

export default class Dialog extends React.PureComponent {
  static defaultProps = {
    width: 500,
    noActions: false
  };

  static propTypes = {
    title: PropTypes.string,
    isOpen: PropTypes.bool,
    noActions: PropTypes.bool,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(e);
  };

  render() {
    const { width, title, isOpen, onCancel, children, className, noActions, ...rest } = this.props;

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
          <form method="post" onSubmit={this.handleSubmit}>
            {children}
            {!noActions && (
              <div className={styles.operation}>
                <Button type="default" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Confirm
                </Button>
              </div>
            )}
          </form>
        </div>
      </Modal>
    );
  }
}
