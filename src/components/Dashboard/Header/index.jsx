import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import { noop } from 'lodash';

import { Link } from 'react-router-dom';
import { Icon, Button, Input } from 'components/Base';

import styles from './index.scss';

@translate()
export default class HeaderDashboard extends Component {
  static propTypes = {
    className: PropTypes.string,
    isFixed: PropTypes.bool,
    name: PropTypes.string,
    noSearchBox: PropTypes.bool,
    placeholder: PropTypes.string,
    store: PropTypes.shape({
      searchWord: PropTypes.string,
      onClear: PropTypes.func,
      onSearch: PropTypes.func
    }),
    withCreateBtn: PropTypes.shape({
      linkTo: PropTypes.string,
      onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
    })
  };

  static defaultProps = {
    className: '',
    name: '',
    isFixed: false,
    store: {
      searchWord: '',
      onSearch: noop,
      onClear: noop
    },
    placeholder: '',
    inputMaxLen: 50,
    withCreateBtn: {
      linkTo: '',
      onClick: ''
    },
    noSearchBox: false
  };

  render() {
    const {
      className,
      isFixed,
      name,
      store,
      placeholder,
      inputMaxLen,
      withCreateBtn,
      noSearchBox,
      t
    } = this.props;
    const { onSearch, onClear, searchWord } = store;

    return (
      <div
        className={classnames(className, styles.header, {
          [styles.fixedHeader]: isFixed
        })}
      >
        <div className={styles.name}>{name}</div>
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
            <Button className={styles.btnCreate} type="primary">
              <Icon name="add" size={20} type="white" />
              <span className={styles.btnText}>
                {' '}
                {withCreateBtn.name || t('Create')}{' '}
              </span>
            </Button>
          </Link>
        )}
        {withCreateBtn.onClick && (
          <Button
            className={styles.btnCreate}
            type="primary"
            onClick={withCreateBtn.onClick}
          >
            <Icon name="add" size={20} type="white" />
            <span className={styles.btnText}>
              {' '}
              {withCreateBtn.name || t('Create')}{' '}
            </span>
          </Button>
        )}
      </div>
    );
  }
}
