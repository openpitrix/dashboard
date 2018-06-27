import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class TagNav extends Component {
  static propTypes = {
    tags: PropTypes.array,
    curTag: PropTypes.string,
    changeTag: PropTypes.func
  };

  static defaultProps = {
    changeTag: () => {}
  };

  changeCurTag = tag => {
    this.props.changeTag(tag);
  };

  render() {
    const { tags } = this.props;

    return (
      <div className={styles.tagNav}>
        {tags.map(tag => (
          <div
            className={classnames(styles.tag, { [styles.active]: tag.name === this.props.curTag })}
            key={tag.id}
            onClick={() => this.changeCurTag(tag.name)}
          >
            {tag.name}
          </div>
        ))}
      </div>
    );
  }
}
