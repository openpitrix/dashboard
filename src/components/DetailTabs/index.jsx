import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { noop } from 'lodash';
import { translate } from 'react-i18next';

import styles from './index.scss';

@translate()
export default class DetailTabs extends Component {
  static propTypes = {
    changeTab: PropTypes.func,
    className: PropTypes.string,
    defaultTab: PropTypes.string,
    isAccount: PropTypes.bool,
    tabs: PropTypes.array,
    triggerFirst: PropTypes.bool
  };

  static defaultProps = {
    changeTab: noop,
    tabs: [],
    defaultTab: '',
    isAccount: false,
    triggerFirst: true
  };

  constructor(props) {
    super(props);

    this.state = {
      curTab: props.defaultTab || props.tabs[0]
    };
  }

  componentDidMount() {
    const { triggerFirst } = this.props;
    const { curTab } = this.state;
    triggerFirst && this.props.changeTab(curTab);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.curTab !== this.state.curTab;
  }

  componentDidUpdate() {
    this.props.changeTab(this.state.curTab);
  }

  handleChange = tab => {
    this.setState({ curTab: tab });
  };

  render() {
    const {
      tabs, className, isAccount, t
    } = this.props;
    const { curTab } = this.state;

    return (
      <div
        className={classnames(
          styles.detailTabs,
          { [styles.accountTabs]: isAccount },
          className
        )}
      >
        {tabs.map((tab, idx) => (
          <label
            className={classnames({ [styles.active]: tab === curTab })}
            key={idx}
            onClick={() => this.handleChange(tab)}
          >
            {t(tab)}
          </label>
        ))}
      </div>
    );
  }
}
