import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import classNames from 'classnames';

import { Icon, Popover } from 'components/Base';
import Layout, { Dialog, BreadCrumb } from 'components/Layout';
import { ProviderName } from 'components/TdName';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  runtimeStore: rootStore.runtimeStore,
  clusterStore: rootStore.clusterStore,
  user: rootStore.user
}))
@observer
export default class Runtimes extends Component {
  state = {
    currentType: 'all'
  };

  componentWillMount() {
    const { runtimeStore, clusterStore } = this.props;

    runtimeStore.runtimes = runtimeStore.runtimes.filter(
      rt => rt.status !== 'deleted'
    );

    runtimeStore.reset();
    clusterStore.reset();
  }

  async componentDidMount() {
    const { runtimeStore, clusterStore } = this.props;

    await runtimeStore.fetchAll();
    await clusterStore.fetchAll({
      noLimit: true
    });
  }

  selectType = async (value, flag) => {
    if (flag) {
      return;
    }

    const { runtimeStore } = this.props;
    this.setState({
      currentType: value
    });
    value = value === 'all' ? '' : value;

    await runtimeStore.fetchAll({
      provider: value
    });
  };

  renderHandleMenu = detail => {
    const { runtimeStore, t } = this.props;
    const { showDeleteRuntime } = runtimeStore;

    return (
      <div className="operate-menu">
        <Link to={`/dashboard/runtime/${detail.runtime_id}`}>
          {t('View detail')}
        </Link>
        {detail.status !== 'deleted' && (
          <Fragment>
            <Link to={`/dashboard/runtime/edit/${detail.runtime_id}`}>
              {t('Modify Runtime')}
            </Link>
            <span onClick={() => showDeleteRuntime(detail.runtime_id)}>
              {t('Delete')}
            </span>
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
        <Link
          className={styles.name}
          to={`/dashboard/runtime/${runtime.runtime_id}`}
        >
          {runtime.name}
        </Link>
        <div className={styles.description}>{runtime.description}</div>
        <div className={styles.others}>
          <dl>
            <dt>{t('Cloud Provider')}</dt>
            <dd className={styles.provider}>
              <ProviderName
                name={runtime.provider}
                provider={runtime.provider}
              />
            </dd>
          </dl>
          <dl>
            <dt>{t('Region')}</dt>
            <dd>{runtime.zone}</dd>
          </dl>
          <dl>
            <dt>{t('Clusters')}</dt>
            <dd>
              {
                clusters.filter(
                  cluster => runtime.runtime_id === cluster.runtime_id
                ).length
              }
            </dd>
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
    const { runtimeStore, user, t } = this.props;
    const { runtimes, isLoading } = runtimeStore;

    const types = [
      { name: t('All'), value: 'all' },
      { name: 'QingCloud', value: 'qingcloud' },
      { name: 'AWS', value: 'aws' },
      { name: 'Kubernetes', value: 'kubernetes' }
    ];

    const { currentType } = this.state;
    const { isNormal } = user;

    return (
      <Layout
        isLoading={isLoading}
        pageTitle="My Runtimes"
        className="clearfix"
      >
        {!isNormal && <BreadCrumb linkPath="My Apps>Test>Runtimes" />}

        <div className={styles.types}>
          {types.map(type => (
            <label
              key={type.value}
              className={classNames({
                [styles.active]: type.value === currentType
              })}
              onClick={() => this.selectType(type.value, type.value === currentType)
              }
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

          <Link className={styles.addRuntime} to="/dashboard/runtime/create">
            <Icon name="add" size={32} />
          </Link>
        </div>

        {this.renderDeleteModal()}
      </Layout>
    );
  }
}
