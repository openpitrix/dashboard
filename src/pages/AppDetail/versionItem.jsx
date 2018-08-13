import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './index.scss';

@translate()
export default class VersionItem extends PureComponent {
  static defaultProps = {
    title: '',
    values: '',
    type: ''
  };

  static propTypes = {
    title: PropTypes.string,
    value: PropTypes.node,
    type: PropTypes.string
  };

  resolveValue(value = []) {
    if (typeof value === 'string') {
      if (value.indexOf(',') > -1) {
        value = value.split(',');
      }
    }

    if (!Array.isArray(value)) {
      value = [value].filter(Boolean);
    }

    return value;
  }

  renderValue(value, type) {
    const { t } = this.props;

    if (!value || value === 'null') {
      return t('None');
    }

    if (type === 'link') {
      return this.resolveValue(value).map((item, idx) => (
        <div key={idx} className={styles.linkItem}>
          <a href={item} target="_blank">
            {item}
          </a>
        </div>
      ));
    }

    if (type === 'maintainer') {
      try {
        value = JSON.parse(value);
      } catch (e) {}

      return this.resolveValue(value).map((item, idx) => (
        <div key={idx} className={styles.linkItem}>
          <a href={`mailto:${item.email || ''}`}>{item.name || ''}</a>
        </div>
      ));
    }

    return value.toString();
  }

  render() {
    const { title, value, type } = this.props;

    return (
      <div className={styles.versionItem}>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>{this.renderValue(value, type)}</div>
      </div>
    );
  }
}
