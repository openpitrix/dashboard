import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _, { noop } from 'lodash';
import { Translation } from 'react-i18next';

import styles from './index.scss';

export default class DetailTabs extends Component {
  static propTypes = {
    activeTab: PropTypes.string,
    changeTab: PropTypes.func,
    className: PropTypes.string,
    defaultTab: PropTypes.string,
    isAccount: PropTypes.bool,
    isCardTab: PropTypes.bool,
    tabs: PropTypes.array
  };

  static defaultProps = {
    changeTab: noop,
    tabs: [],
    defaultTab: '',
    isAccount: false
  };

  static displayName = 'DetailTabs';

  constructor(props) {
    super(props);

    const firstTab = props.tabs[0];
    this.state = {
      curTab:
        props.defaultTab
        || props.activeTab
        || (_.isObject(firstTab) ? firstTab.value : firstTab)
    };
  }

  componentDidMount() {
    this.props.changeTab(this.state.curTab);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.curTab !== this.state.curTab;
  }

  handleChange = tab => {
    const tabValue = _.isObject(tab) ? tab.value : tab;

    if (!tab.disabled) {
      this.setState({ curTab: tabValue }, () => {
        this.props.changeTab(tabValue);
      });
    }
  };

  render() {
    const {
      tabs, className, isAccount, isCardTab
    } = this.props;
    const { curTab } = this.state;

    return (
      <div
        className={classnames(
          styles.detailTabs,
          {
            [styles.accountTabs]: isAccount,
            [styles.cardTabs]: isCardTab
          },
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
              <Translation>{t => t(tabName)}</Translation>
            </label>
          );
        })}
      </div>
    );
  }
}
