import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { inject } from 'mobx-react';
import TabsNav from 'components/TabsNav';
import Notification from 'components/Base/Notification';
import { getSessInfo } from 'src/utils';

import styles from './index.scss';

@inject('sessInfo')
export default class Layout extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    msg: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    hideMsg: PropTypes.func,
    noTabs: PropTypes.bool,
    noNotification: PropTypes.bool
  };

  static defaultProps = {
    msg: '',
    hideMsg: () => {},
    noTabs: false,
    noNotification: false
  };

  constructor(props) {
    super(props);
    this.availableLinks = [];
    this.linkPrefix = '';
  }

  renderNotification() {
    if (this.props.noNotification) return null;
    let { msg } = this.props;
    if (typeof msg === 'object') {
      msg = msg + ''; // transform mobx object
    }
    const { hideMsg } = this.props;

    return msg ? <Notification message={msg} onHide={hideMsg} /> : null;
  }

  renderTabs() {
    const loginRole = getSessInfo('role', this.props.sessInfo);
    const basicLinks = [{ '': 'overview' }, 'apps', 'clusters', 'runtimes'];

    if (loginRole === 'normal') {
      this.linkPrefix = '/deploy';
      this.availableLinks = [...basicLinks];
    } else if (loginRole === 'developer') {
      this.linkPrefix = '/develop';
      this.availableLinks = [...basicLinks, 'repos'];
    } else if (loginRole === 'admin') {
      this.linkPrefix = '/manage';
      this.availableLinks = [...basicLinks, 'repos', 'users', 'roles', 'categories'];
    }

    const options = { prefix: this.linkPrefix };

    return <TabsNav links={this.availableLinks} options={options} />;
  }

  render() {
    const { className, noTabs, noNotification, children } = this.props;

    return (
      <div className={classnames(styles.container, className)}>
        {noTabs ? null : this.renderTabs()}
        {noNotification ? null : this.renderNotification()}
        {children}
      </div>
    );
  }
}

export BackBtn from './BackBtn';
export CreateResource from './CreateResource';
