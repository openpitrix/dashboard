import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ClipboardJS from 'clipboard';

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
    let clipboard = new ClipboardJS('.copyId');
    clipboard.on('success', function(e) {
      e.clearSelection();
    });
  }

  onHide = () => {
    this.setState({
      message: ''
    });
  };

  copyNote = () => {
    this.setState({
      message: 'Copy success'
    });
  };

  render() {
    const { id } = this.props;
    const { message } = this.state;

    return (
      <div className={styles.copyId}>
        id: {id}
        <span className="copyId" data-clipboard-text={id} onClick={this.copyNote}>
          <Icon name="copy" />
        </span>
        {message ? (
          <Notification message={message} timeOut={1000} onHide={this.onHide} type="success" />
        ) : null}
      </div>
    );
  }
}
