import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Icon, Button, Input } from 'components/Base';

import styles from './index.scss';

const Toolbar = ({
  className,
  onSearch,
  onClear,
  searchWord,
  placeholder,
  onRefresh,
  inputMaxLen
}) => (
  <div className={classnames(styles.toolbar, className)}>
    <Input.Search
      className={styles.search}
      placeholder={placeholder}
      value={searchWord}
      onSearch={onSearch}
      onClear={onClear}
      maxLength={inputMaxLen}
    />
    <Button className={styles.refreshBtn} onClick={onRefresh}>
      <Icon name="refresh" size="mini" />
    </Button>
  </div>
);

Toolbar.propTypes = {
  className: PropTypes.string,
  onSearch: PropTypes.func,
  onClear: PropTypes.func,
  onRefresh: PropTypes.func,
  searchWord: PropTypes.string,
  placeholder: PropTypes.string,
  inputMaxLen: PropTypes.number
};

Toolbar.defaultProps = {
  inputMaxLen: 50,
  placeholder: 'Search..'
};

export default Toolbar;
