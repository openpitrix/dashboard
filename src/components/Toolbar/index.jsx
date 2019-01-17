import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop } from 'lodash';
import { Link, withRouter } from 'react-router-dom';

import { Icon, Button, Input } from 'components/Base';

import styles from './index.scss';

export class Toolbar extends React.Component {
  static propTypes = {
    changeView: PropTypes.func,
    children: PropTypes.node,
    className: PropTypes.string,
    inputMaxLen: PropTypes.number,
    noRefreshBtn: PropTypes.bool,
    noSearchBox: PropTypes.bool,
    onClear: PropTypes.func,
    onRefresh: PropTypes.func,
    onSearch: PropTypes.func,
    placeholder: PropTypes.string,
    searchWord: PropTypes.string,
    viewType: PropTypes.string,
    withCreateBtn: PropTypes.shape({
      linkTo: PropTypes.string,
      onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
    })
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
      onClick: ''
    },
    noSearchBox: false,
    noRefreshBtn: false,
    viewType: '',
    changeView: noop
  };

  onSearch = word => {
    const { history, onSearch } = this.props;
    history.push({
      search: `keyword=${word}`
    });
    onSearch(word);
  };

  onClear = () => {
    const { history, onClear } = this.props;
    history.push({
      search: ''
    });
    onClear();
  };

  render() {
    const {
      className,
      searchWord,
      placeholder,
      inputMaxLen,
      children,
      withCreateBtn,
      noSearchBox,
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
            onSearch={this.onSearch}
            onClear={this.onClear}
            maxLength={inputMaxLen}
          />
        )}
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
            onClick={withCreateBtn.onClick}
          >
            {withCreateBtn.name || 'Create'}
          </Button>
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
        {/* {!noRefreshBtn && (
          <Button className={styles.refreshBtn} onClick={onRefresh}>
            <Icon name="refresh" size="mini" />
          </Button>
        )} */}
      </div>
    );
  }
}

export default withRouter(Toolbar);
