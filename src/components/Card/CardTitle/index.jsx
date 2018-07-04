import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import styles from './index.scss';

export default class CardTitle extends PureComponent {
  static propTypes = {
    categoryId: PropTypes.string,
    title: PropTypes.string,
    fixTitle: PropTypes.string,
    more: PropTypes.bool
  };

  render() {
    const { categoryId, title, more, fixTitle } = this.props;

    return (
      <div className={classnames(styles.title, { [styles.fixTitle]: fixTitle })}>
        {title}
        {more && (
          <Link
            className={classnames(styles.more, { [styles.show]: more })}
            to={`/apps/${categoryId}`}
          >
            more...
          </Link>
        )}
      </div>
    );
  }
}
