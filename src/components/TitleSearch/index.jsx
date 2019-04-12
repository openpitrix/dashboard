import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { noop } from 'lodash';

import { Input } from 'components/Base';

import styles from './index.scss';

@withTranslation()
export default class TitleSearch extends Component {
  static propTypes = {
    onClear: PropTypes.func,
    onSearch: PropTypes.func,
    placeholder: PropTypes.string,
    searchWord: PropTypes.string,
    title: PropTypes.string
  };

  static defaultProps = {
    title: '',
    searchWord: '',
    onSearch: noop,
    onClear: noop,
    placeholder: ''
  };

  render() {
    const {
      onSearch, onClear, searchWord, placeholder, title
    } = this.props;

    return (
      <div className={styles.titleSearch}>
        {title}
        <Input.Search
          className={styles.search}
          placeholder={placeholder}
          value={searchWord}
          onSearch={onSearch}
          onClear={onClear}
        />
      </div>
    );
  }
}
