import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ClipboardJS from 'clipboard';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import { Checkbox, Icon, Image } from 'components/Base';
import styles from './index.scss';

@withTranslation()
@inject('rootStore')
@observer
export default class TdName extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    description: PropTypes.string,
    hasChild: PropTypes.bool,
    image: PropTypes.string,
    imageSize: PropTypes.number,
    linkUrl: PropTypes.string,
    name: PropTypes.string,
    noCopy: PropTypes.bool,
    noIcon: PropTypes.bool,
    onExtendedChange: PropTypes.func
  };

  static defaultProps = {
    onExtendedChange: () => {},
    noIcon: false,
    noCopy: false
  };

  componentDidMount() {
    const { noCopy, t } = this.props;

    if (!noCopy) {
      this.clipboard = new ClipboardJS(this.copyBtn);

      this.clipboard.on('success', e => {
        this.props.rootStore.notify({
          message: t('Copy success'),
          type: 'success'
        });
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
        <Image src={image} iconLetter={name} iconSize={36} />
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
          <Checkbox
            isFold={true}
            fold={fold}
            value={rowKey}
            onChange={onExtendedChange}
          />
        )}
        <span
          className={classnames(styles.info, {
            [styles.flexCenter]: noDescription && noCopy
          })}
        >
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
            <span
              className="copy"
              data-clipboard-text={description}
              ref={node => {
                this.copyBtn = node;
              }}
            >
              <Icon name="copy" type="dark" />
            </span>
          )}
        </span>
      </span>
    );
  }
}

export ProviderName from './ProviderName';
