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
    noCopy: PropTypes.bool,
    noIcon: PropTypes.bool
  };

  static defaultProps = {
    noIcon: false
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

  renderIcon() {
    const { noIcon, image } = this.props;
    const isIcon = ['appcenter', 'cluster'].includes(image);

    if (noIcon) {
      return null;
    }

    if (isIcon) {
      return <Icon name={image} size={24} />;
    }
    if (!isIcon) {
      return <Image src={image} className={styles.image} />;
    }
  }

  render() {
    const { image, name, description, linkUrl, noCopy } = this.props;
    const { message } = this.state;
    const isIcon = ['appcenter', 'cluster'].includes(image);

    return (
      <span className={styles.tdName}>
        {this.renderIcon()}
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
