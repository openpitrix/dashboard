import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ClipboardJS from 'clipboard';
import classnames from 'classnames';

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
    className: PropTypes.string,
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
    const nonIcon = '/assets/none.svg';

    if (noIcon) {
      return null;
    }

    if (isIcon) {
      return (
        <span className={styles.image}>
          <img src={nonIcon} />
        </span>
      );
    }
    if (!isIcon && image) {
      return (
        <span className={styles.image}>
          <Image src={image} />
        </span>
      );
    }
  }

  render() {
    const { name, description, linkUrl, noCopy, className } = this.props;
    const { message } = this.state;

    return (
      <span className={classnames(styles.tdName, className)}>
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
          <span className={styles.description} title={description}>
            {description}&nbsp;
          </span>
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
