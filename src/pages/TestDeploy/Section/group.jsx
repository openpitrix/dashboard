import React from 'react';
import PropTypes from 'prop-types';

import Section from './section';
import factory from 'lib/config-parser/section';

import styles from './index.scss';

export default class DeployGroup extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    seq: PropTypes.number
  };

  static defaultProps = {
    detail: {},
    seq: 0
  };

  renderSingle = item => {
    if (typeof item.toJSON === 'function') {
      item = item.toJSON();
    }

    return <Section detail={item} />;
  };

  render() {
    const { detail, seq } = this.props;
    const isNormalGroup = Array.isArray(detail.items);
    const title = isNormalGroup ? detail.title : detail.label || detail.key;
    const items = isNormalGroup ? detail.items : factory(detail.properties);

    return (
      <div className={styles.group}>
        <h2 className={styles.title}>{`${seq + 1}. ${title}`}</h2>
        {items.map((item, idx) => {
          return <div key={idx}>{this.renderSingle(item)}</div>;
        })}
      </div>
    );
  }
}
