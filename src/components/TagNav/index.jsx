import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import styles from './index.scss';

export default class SubHeader extends Component {
  static propTypes = {
    curTag: PropTypes.string
  };

  render() {
    const { tags, curTag } = this.props;

    return (
      <div className={styles.tagNav}>
        {tags.map(tag => (
          <Link
            className={classnames({ [styles.current]: tag.current })}
            key={tag.id}
            to={`${tag.link}`}
          >
            {tag.name}
          </Link>
        ))}
      </div>
    );
  }
}
