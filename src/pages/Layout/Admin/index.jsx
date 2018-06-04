import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import TabsNav from 'components/TabsNav';
import Notification from 'components/Base/Notification';
import acl from 'src/utils/acl';

import styles from './index.scss';

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

    if (acl.isDeveloper()) {
      this.availableLinks = [{ '': 'overview' }, 'apps', 'clusters', 'runtimes', 'repos'];
      this.linkPrefix = '/develop';
    }

    if (acl.isAdmin()) {
      this.availableLinks = [
        { '': 'overview' },
        'apps',
        'clusters',
        'runtimes',
        'repos',
        'users',
        'roles',
        'categories'
      ];
      this.linkPrefix = '/manage';
    }
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
