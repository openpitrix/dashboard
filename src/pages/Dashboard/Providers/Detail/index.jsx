import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';
import classnames from 'classnames';
import _ from 'lodash';

import Layout, {
  Grid, Section, Card, Dialog
} from 'components/Layout';
import Status from 'components/Status';
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
  constructor(props) {
    super(props);
    this.state = {
      activeType: 'processed'
    };
  }

  changeTab = tab => {
    const { appStore } = this.props;
    appStore.detailTab = tab;
  };

  async componentDidMount() {
    const {
      appVersionStore, appStore, repoStore, userStore, t
    } = this.props;

    appVersionStore.registerStore('app', appStore);
    appVersionStore.registerStore('user', userStore);

    appVersionStore.isReview = true;

    await appVersionStore.fetchAll();
    await repoStore.fetchAll({
      status: ['active', 'deleted'],
      noLimit: true
    });
  }

  renderApps() {
    return <Card>renderApps</Card>;
  }

  renderMargin() {
    return <Card>renderMargin</Card>;
  }

  renderProviderInfo() {
    return <Card>renderProviderInfo</Card>;
  }

  renderStatistics() {
    return <Card>renderStatistics</Card>;
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
