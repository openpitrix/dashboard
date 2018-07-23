import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ClipboardJS from 'clipboard';

import { Icon, Notification, Image } from 'components/Base';
import styles from './index.scss';

export default class TdName extends PureComponent {
  static propTypes = {
    image: PropTypes.string,
    imageSize: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    linkUrl: PropTypes.string,
    noCopy: PropTypes.bool
  };

  state = {
    message: ''
  };

  componentDidMount() {
    this.clipboard = new ClipboardJS('.copy');
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
    const { image, name, description, linkUrl, noCopy } = this.props;
    const { message } = this.state;
    const isIcon = ['appcenter', 'cluster'].includes(image);

    return (
      <span className={styles.tdName}>
        {isIcon && <Icon name={image} size={24} />}
        {!isIcon && <Image src={image} className={styles.image} />}
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
            <span className="copy" data-clipboard-text={description} onClick={this.copyNote}>
              <Icon name="copy" type="dark" />
            </span>
          )}
        </span>
        {message ? (
          <Notification message={message} timeOut={1000} onHide={this.onHide} type="success" />
        ) : null}
      </span>
    );
  }
}

export ProviderName from './ProviderName';
