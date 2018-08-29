import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { inject, observer } from 'mobx-react';
import { noop, clone, isEmpty, get } from 'lodash';

import { Notification } from 'components/Base';
import TabsNav from 'components/TabsNav';
import Loading from 'components/Loading';
import { getSessInfo } from 'src/utils';

import styles from './index.scss';

@inject('rootStore', 'sessInfo', 'sock')
@observer
export default class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    noNotification: PropTypes.bool,
    noTabs: PropTypes.bool,
    backBtn: PropTypes.node,
    isLoading: PropTypes.bool,
    loadClass: PropTypes.string,
    sockMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    listenToJob: PropTypes.func,
    isProfile: PropTypes.bool
  };

  static defaultProps = {
    msg: '',
    noTabs: false,
    noNotification: false,
    backBtn: null,
    sockMessage: '',
    listenToJob: noop,
    isProfile: false
  };

  constructor(props) {
    super(props);
    this.availableLinks = [];
    this.linkPrefix = '/dashboard';
  }

  componentDidMount() {
    const { sock, listenToJob } = this.props;
    sock && sock.on('ops-resource', listenToJob);
  }

  componentWillUnmount() {
    const { sock } = this.props;

    if (sock && !isEmpty(sock._events)) {
      sock._events = {};
    }
  }

  renderTabs(isProfile) {
    const loginRole = getSessInfo('role', this.props.sessInfo);
    const normalLinks = [{ '': 'overview' }, 'apps', 'clusters', 'runtimes'];
    if (isProfile) {
      this.linkPrefix = '/profile';
      this.availableLinks = [{ '': 'profile' }, { sshkeys: 'SSH Keys' }];
    } else if (loginRole === 'normal') {
      this.availableLinks = [...normalLinks];
      this.availableLinks.splice(1, 1);
    } else if (loginRole === 'developer') {
      this.availableLinks = [...normalLinks, 'repos'];
    } else if (loginRole === 'admin') {
      this.availableLinks = [...normalLinks, 'repos', 'categories']; // hide user tab
    }

    const options = { prefix: this.linkPrefix };

    return <TabsNav links={this.availableLinks} options={options} />;
  }

  // renderSocketMessage() {
  //   const { sockMessage, rootStore, noNotification } = this.props;
  //
  //   let sockMsg = clone(sockMessage);
  //   if (typeof sockMsg === 'object') {
  //     sockMsg = sockMsg + '';
  //   }
  //
  //   if(!sockMsg){
  //     return null;
  //   }
  //
  //   // push side-effect to next tick
  //   // !noNotification && setTimeout(()=> {
  //   //   rootStore.notify({
  //   //     type: 'info',
  //   //     message: `Socket Message: ${sockMsg}`
  //   //   });
  //   // });
  //
  //   // todo: currently no need to implement job tips
  //   // return null;
  // }

  render() {
    const {
      className,
      noTabs,
      noNotification,
      children,
      isLoading,
      loadClass,
      backBtn,
      isProfile
    } = this.props;

    return (
      <div className={classnames(styles.layout, className, { [styles.noTabs]: noTabs })}>
        {noTabs ? null : this.renderTabs(isProfile)}
        {noNotification ? null : <Notification />}
        {backBtn}
        {/*{this.renderSocketMessage()}*/}
        <Loading isLoading={isLoading} className={styles[loadClass]}>
          {children}
        </Loading>
      </div>
    );
  }
}
