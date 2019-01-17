import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import { observer, inject } from 'mobx-react';

import { Input } from 'components/Base';
import { getUrlParam } from 'utils/url';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore
}))
@observer
export class SearchBox extends React.Component {
  static propTypes = {
    className: PropTypes.string
  };

  onSearch = value => {
    this.props.rootStore.setSearchWord(value);
    this.props.history.push(`/?q=${value}`);
  };

  onClearSearch = () => {
    const { rootStore, appStore, history } = this.props;
    appStore.currentPage = 1;
    rootStore.setSearchWord('');
    history.push('/');
  };

  render() {
    const { rootStore, t, className } = this.props;
    const { searchWord } = rootStore;

    return (
      <Input.Search
        className={classnames(styles.search, className)}
        placeholder={t('search.placeholder')}
        value={searchWord || getUrlParam('q')}
        onSearch={this.onSearch}
        onClear={this.onClearSearch}
      />
    );
  }
}

export default withRouter(SearchBox);
