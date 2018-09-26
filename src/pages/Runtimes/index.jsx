import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import classNames from 'classnames';

import { Icon, Button, Popover } from 'components/Base';
import Layout, { Dialog, NavLink } from 'components/Layout';
import { ProviderName } from 'components/TdName';
import { getSessInfo } from 'utils';

import styles from './index.scss';

@translate()
@inject(({ rootStore, sessInfo }) => ({
  runtimeStore: rootStore.runtimeStore,
  clusterStore: rootStore.clusterStore,
  rootStore,
  sessInfo
}))
@observer
export default class Runtimes extends Component {
  static async onEnter({ runtimeStore, clusterStore }) {
    await runtimeStore.fetchAll();
    await clusterStore.fetchAll({
      noLimit: true
    });
  }

  constructor(props) {
    super(props);
    const { runtimeStore, clusterStore } = this.props;
    runtimeStore.loadPageInit();
    clusterStore.loadPageInit();
    this.state = {
      currentType: 'all'
    };
  }

  componentWillMount() {
    const { runtimeStore } = this.props;
    runtimeStore.runtimes = runtimeStore.runtimes.filter(rt => rt.status !== 'deleted');
  }

  selectType = (value, flag) => {
    if (flag) {
      return;
    }

    const { runtimeStore } = this.props;
    this.setState({
      currentType: value
    });
    value = value === 'all' ? '' : value;
    runtimeStore.fetchAll({
      provider: value
    });
  };

  renderHandleMenu = detail => {
    const { runtimeStore, t } = this.props;
    const { showDeleteRuntime } = runtimeStore;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/runtime/${detail.runtime_id}`}>{t('View detail')}</Link>
        {detail.status !== 'deleted' && (
          <Fragment>
            <Link to={`/dashboard/runtime/edit/${detail.runtime_id}`}>{t('Modify Runtime')}</Link>
            <span onClick={() => showDeleteRuntime(detail.runtime_id)}>{t('Delete')}</span>
          </Fragment>
        )}
      </div>
    );
  };

  renderDeleteModal = () => {
    const { runtimeStore, t } = this.props;
    const { isModalOpen, hideModal, remove } = runtimeStore;

    return (
      <Dialog
        title={t('Delete Runtime')}
        isOpen={isModalOpen}
        onSubmit={remove}
        onCancel={hideModal}
      >
        {t('Delete Runtime desc')}
      </Dialog>
    );
  };

  renderRuntimeCard(runtime) {
    const { clusterStore, t } = this.props;
    const clusters = clusterStore.clusters.toJSON();

    return (
      <div className={styles.runtimeCard}>
        <Link className={styles.name} to={`/dashboard/runtime/${runtime.runtime_id}`}>
          {runtime.name}
        </Link>
        <div className={styles.description}>{runtime.description}</div>
        <div className={styles.others}>
          <dl>
            <dt>{t('Cloud Provider')}</dt>
            <dd className={styles.provider}>
              <ProviderName name={runtime.provider} provider={runtime.provider} />
            </dd>
          </dl>
          <dl>
            <dt>{t('Region')}</dt>
            <dd>{runtime.zone}</dd>
          </dl>
          <dl>
            <dt>{t('Clusters')}</dt>
            <dd>{clusters.filter(cluster => runtime.runtime_id === cluster.runtime_id).length}</dd>
          </dl>
        </div>

        <div className={styles.operation}>
          <Popover content={this.renderHandleMenu(runtime)}>
            <Icon name="more" />
          </Popover>
        </div>
      </div>
    );
  }

  render() {
    const { runtimeStore, sessInfo, t } = this.props;
    const { runtimes } = runtimeStore;

    const types = [
      { name: 'All', value: 'all' },
      { name: 'QingCloud', value: 'qingcloud' },
      { name: 'AWS', value: 'aws' },
      { name: 'Kubernetes', value: 'kubernetes' }
    ];

    const { currentType } = this.state;
    const isNormal = getSessInfo('role', sessInfo) === 'user';

    return (
      <Layout title="My Runtimes" className="clearfix">
        {!isNormal && (
          <NavLink>
            <Link to="/dashboard/apps">{t('My Apps')}</Link> / {t('Test')} / {t('Runtimes')}
          </NavLink>
        )}

        <div className={styles.types}>
          {types.map(type => (
            <label
              key={type.value}
              className={classNames({ [styles.active]: type.value == currentType })}
              onClick={() => this.selectType(type.value, type.value == currentType)}
            >
              {type.name}
            </label>
          ))}
        </div>

        <div>
          {runtimes.map(runtime => (
            <div key={runtime.runtime_id} className={styles.cardContent}>
              {this.renderRuntimeCard(runtime)}
            </div>
          ))}
        </div>

        <Link className={styles.addRuntime} to="/dashboard/runtime/create">
          <Icon name="add" size={32} />
        </Link>

        {this.renderDeleteModal()}
      </Layout>
    );
  }
}
