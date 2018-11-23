import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import factory from 'lib/config-parser/factory';
import Section from './section';

import styles from './index.scss';

export default class DeployGroup extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    onChange: PropTypes.func,
    onEmpty: PropTypes.func,
    seq: PropTypes.number
  };

  static defaultProps = {
    detail: {},
    seq: 0,
    onChange: _.noop,
    onEmpty: _.noop
  };

  renderSingle = item => {
    if (typeof item.toJSON === 'function') {
      item = item.toJSON();
    }

    return (
      <Section
        detail={item}
        onChange={this.props.onChange}
        onEmpty={this.props.onEmpty}
      />
    );
  };

  render() {
    const { detail, seq } = this.props;
    const isNormalGroup = Array.isArray(detail.items);
    const title = isNormalGroup ? detail.title : detail.label || detail.key;
    const items = isNormalGroup ? detail.items : factory(detail.properties);

    // inject label prefix
    let titlePrefix = '';
    if (detail.labelPrefix) {
      titlePrefix += `${_.capitalize(detail.labelPrefix)}: `;
    }

    return (
      <div className={styles.group}>
        <h2 className={styles.title}>{`${seq + 1}. ${titlePrefix}${title}`}</h2>
        {items.map((item, idx) => (
          <div key={idx}>{this.renderSingle(item)}</div>
        ))}
      </div>
    );
  }
}
