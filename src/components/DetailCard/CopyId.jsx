import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ClipboardJS from 'clipboard';

import { Tooltip } from 'components/Base';
import styles from './index.scss';

export default class CopyId extends PureComponent {
  static propTypes = {
    id: PropTypes.string
  };

  state = {
    visible: false
  };

  componentDidMount() {
    let clipboard = new ClipboardJS('.fa-clipboard');
    let _this = this;
    clipboard.on('success', function(e) {
      _this.setState({ visible: true });
      setTimeout(() => _this.setState({ visible: false }), 2000);
      e.clearSelection();
    });
  }

  renderCopyMsg() {
    return this.state.visible ? <div>Copy Success</div> : null;
  }

  render() {
    const { id } = this.props;

    return (
      <div className={styles.copyId}>
        id: {id}
        <Tooltip className={styles.copyTip} content={this.renderCopyMsg()}>
          <i className="fa fa-clipboard" data-clipboard-text={id} />
        </Tooltip>
      </div>
    );
  }
}
