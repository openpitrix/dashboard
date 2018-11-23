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
    defaultTab: PropTypes.string,
    tabs: PropTypes.array
  };

  static defaultProps = {
    changeTab: noop,
    tabs: [],
    defaultTab: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      curTab: props.defaultTab || props.tabs[0]
    };
  }

  componentDidMount() {
    const { curTab } = this.state;
    this.props.changeTab(curTab);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.curTab !== this.state.curTab;
  }

  handleChange = tab => {
    this.setState({ curTab: tab });
  };

  componentDidUpdate() {
    this.props.changeTab(this.state.curTab);
  }

  render() {
    const { tabs, t } = this.props;
    const { curTab } = this.state;

    return (
      <div className={styles.detailTabs}>
        {tabs.map((tab, idx) => (
          <div
            className={classnames(styles.tab, {
              [styles.active]: tab === curTab
            })}
            key={idx}
            onClick={() => this.handleChange(tab)}
          >
            {t(tab)}
          </div>
        ))}
      </div>
    );
  }
}
