import React, { PureComponent } from 'react';
import classnames from 'classnames';

import Input from '../Base/Input';
import styles from './index.scss';
import PropTypes from 'prop-types';

export default class Banner extends PureComponent {
  static propTypes = {
    onSearch: PropTypes.func
  };

  onSearch = value => {
    this.props.onSearch({ search_word: value });
  };

  render() {
    return (
      <div className={classnames('banner', styles.banner)}>
        <div className={styles.wrapper}>
          <img className="banner-img-1" src="/assets/1-1.svg" alt="" />
          <img className="banner-img-2" src="/assets/1-2.svg" alt="" />
          <img className="banner-img-3" src="/assets/1-3.svg" alt="" />
          <div className={styles.title}>
            Application Management Platform on Multi-Cloud Environment.
          </div>
          <Input.Search
            className={styles.search}
            placeholder="Search apps in Pitrix..."
            onSearch={this.onSearch}
          />
        </div>
      </div>
    );
  }
}
