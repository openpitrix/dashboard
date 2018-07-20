import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ClipboardJS from 'clipboard';

import { Tooltip } from 'components/Base';
import { Icon, Notification } from 'components/Base';
import styles from './index.scss';

export default class CopyId extends PureComponent {
  static propTypes = {
    id: PropTypes.string
  };

  state = {
    message: ''
  };

  componentDidMount() {
    this.clipboard = new ClipboardJS('.copyId');
    this.clipboard.on('success', e => {
      this.setState({
        message: 'Copy success'
      });
      e.clearSelection();
    });
  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  onHide = () => {
    this.setState({
      message: ''
    });
  };

  render() {
    const { id } = this.props;
    const { message } = this.state;

    return (
      <div className={styles.copyId}>
        id: {id}
        <span className="copyId" data-clipboard-text={id}>
          <Icon name="copy" />
        </span>
        {message ? (
          <Notification message={message} timeOut={1000} onHide={this.onHide} type="success" />
        ) : null}
      </div>
    );
  }
}
