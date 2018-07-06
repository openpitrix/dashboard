import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ClipboardJS from 'clipboard';

import styles from './index.scss';

export default class CopyId extends PureComponent {
  static propTypes = {
    id: PropTypes.string
  };

  componentDidMount() {
    let clipboard = new ClipboardJS('.fa-clipboard');
    clipboard.on('success', function(e) {
      e.clearSelection();
    });
  }

  render() {
    const { id } = this.props;

    return (
      <div className={styles.copyId}>
        id: {id}
        <i className="fa fa-clipboard" data-clipboard-text={id} />
      </div>
    );
  }
}
