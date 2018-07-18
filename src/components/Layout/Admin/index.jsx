import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { inject } from 'mobx-react';
import Notification from 'components/Base/Notification';
import { Container } from 'components/Layout';
import TabsNav from 'components/TabsNav';
import Loading from 'components/Loading';
import { getSessInfo } from 'src/utils';

import styles from './index.scss';

@inject('sessInfo')
export default class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    msg: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    hideMsg: PropTypes.func,
    noTabs: PropTypes.bool,
    noNotification: PropTypes.bool,
    isLoading: PropTypes.bool,
    loadClass: PropTypes.string
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
    this.linkPrefix = '/dashboard';
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
    const normalLinks = [{ '': 'overview' }, 'apps', 'clusters', 'runtimes'];

    if (loginRole === 'normal') {
      this.availableLinks = [...normalLinks];
    } else if (loginRole === 'developer') {
      this.availableLinks = [...normalLinks, 'repos'];
    } else if (loginRole === 'admin') {
      this.availableLinks = [...normalLinks, 'repos', 'users', 'categories'];
    }

    const options = { prefix: this.linkPrefix };

    return <TabsNav links={this.availableLinks} options={options} />;
  }

  render() {
    const { className, noTabs, noNotification, children, isLoading, loadClass } = this.props;
    return (
      <div className={classnames(styles.layout, className, { [styles.noTabs]: noTabs })}>
        {noTabs ? null : this.renderTabs()}
        {noNotification ? null : this.renderNotification()}
        <Container>
          <Loading isLoading={isLoading} className={styles[loadClass]}>
            {children}
          </Loading>
        </Container>
      </div>
    );
  }
}

export BackBtn from './BackBtn';
export Dialog from './Dialog';
export CreateResource from './CreateResource';
