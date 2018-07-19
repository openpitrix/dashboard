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
    let _this = this;
    clipboard.on('success', function(e) {
      _this.setState({
        message: 'Copy success!'
      });
      e.clearSelection();
    });
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
        {message ? <Notification message={message} onHide={this.onHide} type="success" /> : null}
      </div>
    );
  }
}
