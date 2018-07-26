import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop } from 'lodash';

import { Icon } from 'components/Base';

import styles from './index.scss';

export default class Pagination extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    defaultCurrent: PropTypes.number,
    current: PropTypes.number,
    defaultPageSize: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    onChange: PropTypes.func,
    selectedRows: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onSelectRow: PropTypes.func,
    noCancel: PropTypes.bool
  };

  static defaultProps = {
    defaultCurrent: 1,
    defaultPageSize: 10,
    total: 100,
    selectedRows: [],
    onSelectRow: noop,
    noCancel: true
  };

  constructor(props) {
    super(props);

    let current = props.defaultCurrent;
    if ('current' in props) {
      current = props.current;
    }

    let pageSize = props.defaultPageSize;
    if ('pageSize' in props) {
      pageSize = props.pageSize;
    }

    this.state = {
      current,
      pageSize,
      selectedRows: props.selectedRows
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current !== this.props.current) {
      this.setState({
        current: nextProps.current
      });
    }

    if (nextProps.selectedRows.length !== this.props.selectedRows) {
      this.setState({ selectedRows: nextProps.selectedRows });
    }
  }

  isValid = p => {
    return typeof p === 'number' && p >= 1 && p !== this.state.current;
  };

  handleChange = p => {
    let page = p;
    if (this.isValid(page)) {
      if (page > this.calculatePage()) {
        page = this.calculatePage();
      }

      const pageSize = this.state.pageSize;
      this.props.onChange(page, pageSize);
      return page;
    }

    return this.state.current;
  };

  prev = () => {
    if (this.hasPrev()) {
      this.handleChange(this.state.current - 1);
    }
  };

  next = () => {
    if (this.hasNext()) {
      this.handleChange(this.state.current + 1);
    }
  };

  hasPrev = () => {
    return this.state.current > 1;
  };

  hasNext = () => {
    return this.state.current < this.calculatePage();
  };

  calculatePage = p => {
    let pageSize = p;
    if (typeof pageSize === 'undefined') {
      pageSize = this.state.pageSize;
    }
    return Math.floor((this.props.total - 1) / pageSize) + 1;
  };

  renderTotal() {
    let { onSelectRow, total, noCancel } = this.props;
    let { selectedRows } = this.state;

    if (!Array.isArray(selectedRows)) {
      selectedRows = Array.from(selectedRows);
    }

    if (selectedRows.length) {
      return (
        <Fragment>
          <span>{`Selected: ${selectedRows.length}`}</span>
          {!noCancel && (
            <span className={styles.cancelBtn} onClick={onSelectRow.bind(null, [], [])}>
              Cancel
            </span>
          )}
        </Fragment>
      );
    }
    return `Total: ${total}`;
  }

  render() {
    const { total, className, ...rest } = this.props;
    const { current } = this.state;
    const totalPage = this.calculatePage();

    if (!total) {
      return null;
    }

    return (
      <div className={classnames(styles.pagination, className)}>
        <div className={styles.total}>{this.renderTotal()}</div>
        <div className={styles.pageItems}>
          <span
            className={classnames(styles.btn, `${this.hasPrev() ? '' : 'btn-disabled'}`)}
            onClick={this.prev}
            aria-disabled={!this.hasPrev()}
          >
            <Icon name="previous" />
          </span>
          <span className={styles.current}>{`${current} / ${totalPage}`}</span>
          <span
            className={classnames(styles.btn, `${this.hasNext() ? '' : 'btn-disabled'}`)}
            onClick={this.next}
            aria-disabled={!this.hasNext()}
          >
            <Icon name="next" />
          </span>
        </div>
      </div>
    );
  }
}
