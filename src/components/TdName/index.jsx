import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ClipboardJS from 'clipboard';

import { Icon, Notification } from 'components/Base';
import styles from './index.scss';

export default class TdName extends PureComponent {
  static propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    linkUrl: PropTypes.string,
    noCopy: PropTypes.bool
  };

  state = {
    message: ''
  };

  componentDidMount() {
    let clipboard = new ClipboardJS('.copy');
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
    const { image, name, description, linkUrl, noCopy } = this.props;
    const { message } = this.state;
    const isIcon = ['appcenter', 'cluster'].find(data => data === image) ? true : false;

    return (
      <span className={styles.tdName}>
        {isIcon && <Icon name={image} size={24} type="coloured" />}
        {!isIcon && image && <img src={image} className={styles.image} />}
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
            <span className="copy" data-clipboard-text={description}>
              <Icon name="copy" />
            </span>
          )}
        </span>
        {message ? <Notification message={message} onHide={this.onHide} type="success" /> : null}
      </span>
    );
  }
}

export ProviderName from './ProviderName';
