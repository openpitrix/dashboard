import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import Input from '../Base/Input';

import styles from './index.scss';
import { inject } from 'mobx-react/index';

// translate hoc should place before mobx
@translate()
@inject('rootStore')
@observer
class TitleBanner extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    hasSearch: PropTypes.bool
  };

  static defaultProps = {
    title: '',
    hasSearch: false
  };

  onSearch = async value => {
    this.props.history.push('/store/search/' + value);
  };

  onClearSearch = async () => {
    this.props.history.push('/');
  };

  render() {
    const { title, hasSearch, t } = this.props;

    return (
      <div className={styles.titleBanner}>
        <div className={styles.wrapper}>
          <span className={styles.name}>{title}</span>
          {hasSearch && (
            <Input.Search
              className={styles.search}
              placeholder={t('search.placeholder')}
              onSearch={this.onSearch}
              onClear={this.onClearSearch}
            />
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(TitleBanner);
