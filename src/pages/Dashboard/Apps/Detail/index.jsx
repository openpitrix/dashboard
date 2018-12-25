import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import _ from 'lodash';
import classNames from 'classnames';

import {
  Icon, Input, Table, Popover, Button, Image
} from 'components/Base';
import Layout, { Grid, Section, Card } from 'components/Layout';
import DetailTabs from 'components/DetailTabs';
import AppName from 'components/AppName';
import Versions from '../../Versions';

import styles from './index.scss';

const tags = [
  { name: '用户实例', value: 'instance' },
  { name: '线上版本', value: 'online' },
  { name: '审核记录', value: 'record' }
];
@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore,
  appVersionStore: rootStore.appVersionStore,
  clusterStore: rootStore.clusterStore,
  user: rootStore.user
}))
@observer
export default class AppDetail extends Component {
  async componentDidMount() {
    const { appStore, clusterStore, match } = this.props;
    const { appId } = match.params;

    await appStore.fetch(appId);

    await clusterStore.fetchAll();
  }

  changeTab = async tab => {
    const { appStore } = this.props;
    if (tab !== appStore.detailTab) {
      appStore.detailTab = tab;

      if (tab === 'online') {
        const { appVersionStore, match } = this.props;
        const { appId } = match.params;
        await appVersionStore.fetchTypeVersions(appId);
      }
    }
  };

  renderInstance() {
    const { t } = this.props;

    return <Card>renderInstance</Card>;
  }

  renderStatistics() {
    const { t } = this.props;

    return (
      <Card className={styles.statistics}>
        <dl>
          <dt>{t('已上架应用')}</dt>
          <dd>5</dd>
        </dl>
        <dl>
          <dt>{t('本月部署次数')}</dt>
          <dd>555</dd>
        </dl>
        <dl>
          <dt>{t('总部署次数')}</dt>
          <dd>8686</dd>
        </dl>
        <dl>
          <dt>{t('综合评价')}</dt>
          <dd>
            3.0<label>
              <Icon
                name="star"
                size={16}
                type="dark"
                className={styles.yellow}
              />
              <Icon
                name="star"
                size={16}
                type="dark"
                className={styles.yellow}
              />
              <Icon
                name="star"
                size={16}
                type="dark"
                className={styles.yellow}
              />
              <Icon name="star" size={16} type="dark" />
              <Icon name="star" size={16} type="dark" />
            </label>
          </dd>
        </dl>
      </Card>
    );
  }

  renderAppBase() {
    const { appStore, t } = this.props;
    const { appDetail } = appStore;
    const categories = _.get(appDetail, 'category_set', []);

    return (
      <Card className={styles.appBase}>
        <div className={styles.title}>
          <span className={styles.image}>
            <Image
              src={appDetail.icon}
              iconLetter={appDetail.name}
              iconSize={48}
            />
          </span>
          <span className={styles.appName}>{appDetail.name}</span>
        </div>
        <div className={styles.info}>
          <dl>
            <dt>{t('应用编号')}</dt>
            <dd>{appDetail.app_id}</dd>
          </dl>
          <dl>
            <dt>{t('交付类型')}</dt>
            <dd>{appDetail.app_version_types}</dd>
          </dl>
          <dl>
            <dt>{t('应用介绍')}</dt>
            <dd>{appDetail.abstraction}</dd>
          </dl>
          <dl>
            <dt>{t('分类')}</dt>
            <dd>
              {categories.map(item => (
                <label key={item.category_id}>{item.name}</label>
              ))}
            </dd>
          </dl>
          <dl>
            <dt>{t('开发者')}</dt>
            <dd>{appDetail.owner}</dd>
          </dl>
          <dl>
            <dt>{t('上架时间')}</dt>
            <dd>{appDetail.status_time}</dd>
          </dl>
          <Link to="/" className={styles.link}>
            {t('去商店中查看')} →
          </Link>
        </div>
      </Card>
    );
  }

  render() {
    const {
      appVersionStore, appStore, clusterStore, t
    } = this.props;
    const { detailTab } = appStore;

    return (
      <Layout pageTitle={t('应用详情')} hasBack>
        <Grid>
          <Section size={4}>{this.renderAppBase()}</Section>
          <Section size={8}>
            {this.renderStatistics()}
            <DetailTabs tabs={tags} changeTab={this.changeTab} />
            {detailTab === 'instance' && this.renderInstance()}
            {detailTab === 'online' && <Versions />}
            {detailTab === 'record' && this.renderInstance()}
          </Section>
        </Grid>
      </Layout>
    );
  }
}
