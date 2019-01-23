import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _, { noop } from 'lodash';
import { translate } from 'react-i18next';

import styles from './index.scss';

@translate()
export default class DetailTabs extends Component {
  static propTypes = {
    changeTab: PropTypes.func,
    className: PropTypes.string,
    defaultTab: PropTypes.string,
    isAccount: PropTypes.bool,
    tabs: PropTypes.array
  };

  static defaultProps = {
    changeTab: noop,
    tabs: [],
    defaultTab: '',
    isAccount: false
  };

  constructor(props) {
    super(props);

    const firstTab = props.tabs[0];
    this.state = {
      curTab:
        props.defaultTab || _.isObject(firstTab) ? firstTab.value : firstTab
    };
  }

  componentDidMount() {
    this.props.changeTab(this.state.curTab);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.curTab !== this.state.curTab;
  }

  componentDidUpdate() {
    this.props.changeTab(this.state.curTab);
  }

  handleChange = tab => {
    const tabValue = _.isObject(tab) ? tab.value : tab;

    if (!tab.disabled) {
      this.setState({ curTab: tabValue });
    }
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
        {tabs.map((tab, idx) => {
          const tabVal = _.isObject(tab) ? tab.value : tab;
          const tabName = _.isObject(tab) ? tab.name : tab;

          return (
            <label
              className={classnames({
                [styles.active]: tabVal === curTab,
                [styles.disabled]: _.isObject(tab) && tab.disabled
              })}
              key={idx}
              onClick={() => this.handleChange(tab)}
            >
              {t(tabName)}
            </label>
          );
        })}
      </div>
    );
  }
}
