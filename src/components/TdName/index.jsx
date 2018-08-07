import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ClipboardJS from 'clipboard';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Icon, Image } from 'components/Base';
import styles from './index.scss';

@translate()
@inject('rootStore')
@observer
export default class TdName extends React.Component {
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
    noIcon: false,
    noCopy: false
  };

  componentDidMount() {
    const { noCopy, t } = this.props;

    if (!noCopy) {
      this.clipboard = new ClipboardJS(this.refs.copyBtn);

      this.clipboard.on('success', e => {
        this.props.rootStore.notify({ message: t('Copy success'), type: 'success' });
        e.clearSelection();
      });
    }
  }

  componentWillUnmount() {
    this.clipboard && this.clipboard.destroy();
  }

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
            <span className="copy" data-clipboard-text={description} ref="copyBtn">
              <Icon name="copy" type="dark" />
            </span>
          )}
        </span>
      </span>
    );
  }
}

export ProviderName from './ProviderName';
