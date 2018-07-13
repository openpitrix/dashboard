import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ClipboardJS from 'clipboard';

import { Tooltip } from 'components/Base';
import styles from './index.scss';
import { throttle } from 'lodash';

export default class TdName extends PureComponent {
  static propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    linkUrl: PropTypes.string,
    noCopy: PropTypes.bool
  };

  state = {
    visible: false
  };

  componentDidMount() {
    let clipboard = new ClipboardJS('.fa-clipboard');
    let _this = this;
    clipboard.on('success', function(e) {
      _this.setState({ visible: true });
      setTimeout(() => _this.setState({ visible: false }), 1000);
      e.clearSelection();
    });
  }

  renderCopyMsg() {
    return this.state.visible ? <div>Copy Success</div> : null;
  }

  render() {
    const { image, name, description, linkUrl, noCopy } = this.props;
    return (
      <span className={styles.tdName}>
        {image && <img src={image} className={styles.image} />}
        <span className={styles.info}>
          {linkUrl && (
            <Link className={styles.name} to={linkUrl} title={name}>
              {name}&nbsp;
            </Link>
          )}
          {!linkUrl && (
            <span className={styles.name} title={name}>
              {name}&nbsp;
            </span>
          )}
          <span className={styles.description}>{description}&nbsp;</span>
          {!noCopy && (
            <Tooltip className={styles.copyTip} content={this.renderCopyMsg()}>
              <i className="fa fa-clipboard" data-clipboard-text={description} />
            </Tooltip>
          )}
        </span>
      </span>
    );
  }
}
