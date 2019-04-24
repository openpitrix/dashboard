import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _, { noop } from 'lodash';
import { Link, withRouter } from 'react-router-dom';

import { Icon, Button, Input } from 'components/Base';
import Can from 'components/Can';

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

  get searchClass() {
    const { withCreateBtn, children } = this.props;
    const noCreate = !withCreateBtn.linkTo && !_.isFunction(withCreateBtn.onClick);
    const noChildren = _.isEmpty(children);
    return classnames(styles.search, {
      [styles.largeSearch]: noCreate && noChildren
    });
  }

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
            className={this.searchClass}
            placeholder={placeholder}
            value={searchWord}
            onSearch={this.onSearch}
            onClear={this.onClear}
            maxLength={inputMaxLen}
          />
        )}
        <Can
          do="show"
          action={withCreateBtn.action}
          condition={withCreateBtn.condition}
        >
          {withCreateBtn.linkTo && (
            <Link data-cy={withCreateBtn.dataTestID} to={withCreateBtn.linkTo}>
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
              data-cy={withCreateBtn.dataTestID}
            >
              {withCreateBtn.name || 'Create'}
            </Button>
          )}
        </Can>
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
