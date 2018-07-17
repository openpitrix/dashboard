import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import Input from '../Base/Input';

import styles from './index.scss';

@translate()
export default class Banner extends PureComponent {
  static propTypes = {
    appSearch: PropTypes.string,
    onSearch: PropTypes.func,
    setScroll: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.searchBox = React.createRef();
  }

  onSearch = value => {
    this.props.setScroll();
    this.props.onSearch({ search_word: value });
  };

  onClearSearch = () => {
    this.onSearch('');
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.appSearch !== this.props.appSearch && nextProps.appSearch !== undefined) {
      // clear search box manually
      this.searchBox.current.setState({ value: nextProps.appSearch });
    }
  }

  render() {
    const { appSearch, t } = this.props;

    return (
      <div className={classnames('banner', styles.banner)}>
        <div className={styles.wrapper}>
          <img className="banner-img-1" src="/assets/1-1.svg" alt="" />
          <img className="banner-img-2" src="/assets/1-2.svg" alt="" />
          <img className="banner-img-3" src="/assets/1-3.svg" alt="" />
          <div className={styles.title}>{t('brand.slogan')}</div>
          <Input.Search
            ref={this.searchBox}
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
