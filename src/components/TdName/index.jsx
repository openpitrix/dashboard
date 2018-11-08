import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ClipboardJS from 'clipboard';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Checkbox, Icon, Image } from 'components/Base';
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
    onExtendedChange: PropTypes.func,
    hasChild: PropTypes.bool,
    noIcon: PropTypes.bool
  };

  static defaultProps = {
    onExtendedChange: () => {},
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
    const { noIcon, image, name } = this.props;

    if (noIcon) {
      return null;
    }

    return (
      <span className={styles.image}>
        <Image src={image} iconLetter={name} iconSize={24} />
      </span>
    );
  }

  render() {
    const {
      name,
      description,
      linkUrl,
      noCopy,
      noDescription,
      className,
      rowKey,
      isFold,
      fold,
      onExtendedChange
    } = this.props;
    const nameClass = isFold ? styles.foldName : styles.name;

    return (
      <span className={classnames(styles.tdName, className)}>
        {this.renderIcon()}
        {isFold && (
          <Checkbox isFold={true} fold={fold} value={rowKey} onChange={onExtendedChange} />
        )}
        <span className={styles.info}>
          {linkUrl && (
            <Link className={nameClass} to={linkUrl} title={name}>
              {name}&nbsp;
            </Link>
          )}
          {!linkUrl && (
            <span className={nameClass} title={name}>
              {name}&nbsp;
            </span>
          )}
          {!noDescription && (
            <span className={styles.description} title={description}>
              {description}&nbsp;
            </span>
          )}
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
