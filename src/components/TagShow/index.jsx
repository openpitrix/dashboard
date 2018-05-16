import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class TagShow extends Component {
  static propTypes = {
    tagStyle: PropTypes.oneOf(['yellow', 'purple', 'purple2'])
  };
  render() {
    const { tags, tagStyle } = this.props;
    return tags.map((tag, index) => (
      <div className={classnames(styles.tagShow, styles[tagStyle])} key={index}>
        <div className={styles.inner}>
          <span className={styles.name}>{tag.label_key}</span>
          <span className={styles.content}>{tag.label_value}</span>
        </div>
      </div>
    ));
  }
}
