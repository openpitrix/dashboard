import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class SubHeader extends Component {
  static propTypes = {
    tags: PropTypes.array,
    curTag: PropTypes.string,
    changeCurTag: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.changeCurTag = this.changeCurTag.bind(this);
  }

  changeCurTag(name) {
    this.props.changeCurTag && this.props.changeCurTag(name);
  }

  render() {
    const { tags, curTag } = this.props;

    return (
      <div className={styles.tagNav}>
        {tags.map(tag => (
          <div
            className={classnames(styles.tag, { [styles.active]: tag.name === curTag })}
            key={tag.id}
            onClick={() => {
              this.changeCurTag(tag.name);
            }}
          >
            {tag.name}
          </div>
        ))}
      </div>
    );
  }
}
