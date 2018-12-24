import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import Layout, { Grid, Section, Card } from 'components/Layout';
import { Button, Icon, Image } from 'components/Base';
import DetailTabs from 'components/DetailTabs';
import CertificateInfo from '../CertificateInfo';

import styles from './index.scss';

const tags = [
  { name: 'App', value: 'app' },
  { name: '认证信息', value: 'certificationInfo' },
  { name: '合约', value: 'contract', isDisabled: true },
  { name: '保证金', value: 'margin' }
];
@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appStore: rootStore.appStore
}))
@observer
export default class ProviderDetail extends Component {
  async componentDidMount() {
    // todo
    const { appStore } = this.props;
    appStore.fetchAll({ status: 'active' });
  }

  changeTab = tab => {
    const { appStore } = this.props;
    appStore.detailTab = tab;
  };

  renderMargin() {
    const { t } = this.props;

    return (
      <Card className={styles.margin}>
        <div className={styles.title}>
          {t('当前状态')}：未缴纳
          <Button type="default">
            <Icon name="add" size={20} type="dark" className={styles.icon} />
            {t('添加记录')}
          </Button>
        </div>
        <div>
          <dl>
            <dt>{t('操作')}</dt>
            <dd>平台退回</dd>
          </dl>
          <dl>
            <dt>{t('金额')}</dt>
            <dd>2000.00</dd>
          </dl>
          <dl>
            <dt>{t('凭证编号')}</dt>
            <dd>2093842934503495238405234692345</dd>
          </dl>
          <dl>
            <dt>{t('操作时间')}</dt>
            <dd>2018年10月29日 19:21:32</dd>
          </dl>
          <dl>
            <dt>{t('操作人员')}</dt>
            <dd>Zhenzhen zhenzhen@yunify.com</dd>
          </dl>
        </div>
      </Card>
    );
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

  renderApps() {
    const { appStore, t } = this.props;
    const { apps } = appStore;

    return (
      <Card className={styles.appsInfo}>
        <div className={styles.total}>{t('已上架 10 款应用')}</div>

        <ul>
          {apps.map(item => (
            <li key={item.app_id}>
              <div className={styles.appName}>
                <span className={styles.image}>
                  <Image src={item.icon} iconLetter={item.name} iconSize={36} />
                </span>
                <span className={styles.info}>
                  <div className={styles.name}>{item.name}</div>
                  <div className={styles.description}>{item.description}</div>
                </span>
              </div>
              <div>
                {t('交付方式')}:&nbsp;
                <label className={styles.types}>{item.app_version_types}</label>
                <br />
                {t('总部署次数')}:&nbsp;
                <label className={styles.deployNumber}>10</label>
              </div>
              <div>
                <label className={styles.time}>
                  {t('上架时间')}:&nbsp; 5天前
                </label>
                <Link to={'#'} className={styles.link}>
                  查看详情 →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    );
  }

  renderProviderInfo() {
    const { t } = this.props;

    return (
      <Card className={styles.providerInfo}>
        <div className={styles.title}>
          <div className={styles.number}>
            {t('服务商编号')}:&nbsp; 3920204948
          </div>
          <div className={styles.name}>成都博智维讯信息技术股份有限...</div>
        </div>
        <div className={styles.info}>
          <dl>
            <dt>{t('业务介绍')}</dt>
            <dd>国内领先的互联网级企业解决方案提供商.</dd>
          </dl>
          <dl>
            <dt>{t('公司官网')}</dt>
            <dd>www.biz-united.com.cn</dd>
          </dl>
          <dl>
            <dt>{t('联系人信息')}</dt>
            <dd>
              赵右林<br />
              jordan@biz-united.com.cn<br />
              1891029784
            </dd>
          </dl>
          <dl>
            <dt>{t('入驻时间')}</dt>
            <dd>2018年10月1日</dd>
          </dl>
        </div>
      </Card>
    );
  }

  render() {
    const { t, appStore } = this.props;
    const { detailTab } = appStore;

    return (
      <Layout pageTitle={t('应用服务商详情')} hasBack>
        <Grid>
          <Section size={4}>{this.renderProviderInfo()}</Section>
          <Section size={8}>
            {this.renderStatistics()}
            <DetailTabs tabs={tags} changeTab={this.changeTab} />
            {detailTab === 'app' && this.renderApps()}
            {detailTab === 'certificationInfo' && <CertificateInfo />}
            {detailTab === 'margin' && this.renderMargin()}
          </Section>
        </Grid>
      </Layout>
    );
  }
}
