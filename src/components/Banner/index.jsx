import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';

import Input from '../Base/Input';

import styles from './index.scss';

@translate()
class Banner extends PureComponent {
  onSearch = value => {
    this.props.history.push('/apps/search/' + value);
  };

  onClearSearch = () => {
    this.props.history.push('/');
  };

  render() {
    const { match, t } = this.props;
    const appSearch = match.params.search;

    return (
      <div className={classnames('banner', styles.banner)}>
        <div className={styles.wrapper}>
          <img className="banner-img-1" src="/1-1.svg" alt="" />
          <img className="banner-img-2" src="/1-2.svg" alt="" />
          <img className="banner-img-3" src="/1-3.svg" alt="" />
          <div className={styles.title}>{t('brand.slogan')}</div>
          <Input.Search
            className={styles.search}
            placeholder={t('search.placeholder')}
            value={appSearch}
            onSearch={this.onSearch}
            onClear={this.onClearSearch}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(Banner);
