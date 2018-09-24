import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop } from 'lodash';
import { Link } from 'react-router-dom';

import { Icon, Button, Input } from 'components/Base';

import styles from './index.scss';

class Toolbar extends React.Component {
  static propTypes = {
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
    changeView: PropTypes.func,
    noSearchBox: PropTypes.bool,
    noRefreshBtn: PropTypes.bool
  };

  static defaultProps = {
    searchWord: '',
    onSearch: noop,
    onClear: noop,
    onRefresh: noop,
    inputMaxLen: 50,
    placeholder: '',
    withCreateBtn: {
      linkTo: '',
      onClick: noop
    },
    noSearchBox: false,
    noRefreshBtn: false,
    viewType: '',
    changeView: noop
  };

  render() {
    const {
      className,
      onSearch,
      onClear,
      searchWord,
      placeholder,
      onRefresh,
      inputMaxLen,
      children,
      withCreateBtn,
      noSearchBox,
      noRefreshBtn,
      viewType,
      changeView
    } = this.props;

    return (
      <div className={classnames(styles.toolbar, className)}>
        {!noSearchBox && (
          <Input.Search
            className={styles.search}
            placeholder={placeholder}
            value={searchWord}
            onSearch={onSearch}
            onClear={onClear}
            maxLength={inputMaxLen}
          />
        )}
        {withCreateBtn.linkTo && (
          <Link to={withCreateBtn.linkTo}>
            <Button className={styles.btnRight} type="primary" onClick={withCreateBtn.onClick}>
              {withCreateBtn.name || 'Create'}
            </Button>
          </Link>
        )}
        {viewType && (
          <Fragment>
            <Icon
              name="listview"
              size={24}
              className={styles.viewIcon}
              type={viewType === 'list' ? 'light' : 'dark'}
              onClick={() => changeView('list')}
            />
            <Icon
              name="cardview"
              size={24}
              className={styles.viewIcon}
              type={viewType === 'card' ? 'light' : 'dark'}
              onClick={() => changeView('card')}
            />
          </Fragment>
        )}
        {children}
        {!noRefreshBtn && (
          <Button className={styles.refreshBtn} onClick={onRefresh}>
            <Icon name="refresh" size="mini" />
          </Button>
        )}
      </div>
    );
  }
}

export default Toolbar;
