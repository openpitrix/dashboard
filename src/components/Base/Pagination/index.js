import React from 'react';
import RcPagination from 'rc-pagination';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import enUS from 'rc-pagination/lib/locale/en_US';

import styles from './index.scss';

export default class Pagination extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    defaultCurrent: PropTypes.number,
    current: PropTypes.number,
    defaultPageSize: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    showTotal: PropTypes.func,
    showQuickJumper: PropTypes.bool,
    onChange: PropTypes.func,
    onShowSizeChange: PropTypes.func,
    itemRender: PropTypes.func
  };

  static defaultProps = {
    prefixCls: 'pi-pagination',
    selectPrefixCls: 'pi-select',
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 100,
    showQuickJumper: false,
    showTotal(total) {
      return `Total: ${total}`;
    },
    itemRender(current, type, originalElement) {
      if (type === 'prev') {
        return <span>Last</span>;
      } else if (type === 'next') {
        return <span>Next</span>;
      }
      return originalElement;
    }
  };

  render() {
    const { className, style, ...restProps } = this.props;

    if (!restProps.total) {
      return null;
    }

    return (
      <RcPagination
        className={classNames(styles.pagination, className)}
        style={style}
        locale={enUS}
        {...restProps}
      />
    );
  }
}
