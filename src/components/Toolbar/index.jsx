import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop } from 'lodash';
import { Link } from 'react-router-dom';

import { Icon, Button, Input } from 'components/Base';

import styles from './index.scss';

const Toolbar = ({
  className,
  onSearch,
  onClear,
  searchWord,
  placeholder,
  onRefresh,
  inputMaxLen,
  children,
  withCreateBtn,
  viewType,
  changeView,
  t
}) => (
  <div className={classnames(styles.toolbar, className)}>
    {children || (
      <Fragment>
        <Input.Search
          className={styles.search}
          placeholder={placeholder}
          value={searchWord}
          onSearch={onSearch}
          onClear={onClear}
          maxLength={inputMaxLen}
        />
        {withCreateBtn.linkTo && (
          <Link to={withCreateBtn.linkTo}>
            <Button className={styles.btnRight} type="primary">
              {withCreateBtn.name || 'Create'}
            </Button>
          </Link>
        )}
        {withCreateBtn.onClick && (
          <Button
            className={styles.btnRight}
            type="primary"
            onClick={() => {
              withCreateBtn.onClick();
            }}
          >
            {withCreateBtn.name || 'Create'}
          </Button>
        )}
        {viewType && (
          <Icon
            name="listview"
            size={24}
            className={styles.viewIcon}
            type={viewType === 'list' ? 'light' : 'dark'}
            onClick={() => changeView('list')}
          />
        )}
        {viewType && (
          <Icon
            name="cardview"
            size={24}
            className={styles.viewIcon}
            type={viewType === 'card' ? 'light' : 'dark'}
            onClick={() => changeView('card')}
          />
        )}
        <Button className={styles.refreshBtn} onClick={onRefresh}>
          <Icon name="refresh" size="mini" />
        </Button>
      </Fragment>
    )}
  </div>
);

Toolbar.propTypes = {
  className: PropTypes.string,
  onSearch: PropTypes.func,
  onClear: PropTypes.func,
  onRefresh: PropTypes.func,
  searchWord: PropTypes.string,
  placeholder: PropTypes.string,
  inputMaxLen: PropTypes.number,
  children: PropTypes.node,
  withCreateBtn: PropTypes.shape({
    linkTo: PropTypes.string,
    onClick: PropTypes.func
  }),
  viewType: PropTypes.string,
  changeView: PropTypes.func
};

Toolbar.defaultProps = {
  searchWord: '',
  onSearch: noop,
  onClear: noop,
  onRefresh: noop,
  inputMaxLen: 50,
  placeholder: '',
  withCreateBtn: {},
  viewType: '',
  changeView: noop
};

export default Toolbar;
