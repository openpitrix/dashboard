import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';

import styles from './index.scss';

@withTranslation()
export default class CardTitle extends PureComponent {
  static propTypes = {
    categoryId: PropTypes.string,
    more: PropTypes.bool,
    skipLink: PropTypes.string,
    title: PropTypes.string
  };

  static defaultProps = {
    skipLink: 'apps'
  };

  render() {
    const {
      categoryId, title, more, skipLink, t
    } = this.props;

    return (
      <div className={styles.title}>
        {t(title)}
        {more && (
          <Link
            className={classnames(styles.more, { [styles.show]: more })}
            to={`/${skipLink}/category/${categoryId}`}
          >
            {t('more')}
          </Link>
        )}
      </div>
    );
  }
}
