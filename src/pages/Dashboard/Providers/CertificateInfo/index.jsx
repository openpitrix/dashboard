import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Card } from 'components/Layout';

import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore
}))
@observer
export default class CertificateInfo extends Component {
  render() {
    const { t } = this.props;

    return (
      <Card className={styles.certificateInfo}>
        <div className={styles.title}>{t('认证信息')}</div>
        <div className={styles.info}>
          <dl>
            <dt>{t('公司名称')}</dt>
            <dd>杭州映云科技有限公司</dd>
          </dl>
          <dl>
            <dt>{t('公司官网')}</dt>
            <dd>http://www.crancloud.com/</dd>
          </dl>
          <dl>
            <dt>{t('业务简介')}</dt>
            <dd>
              <pre>
                云基众智—成就边缘加速新价值，提供部署在企业侧的物端边缘计算产品众智云基站和部署在云端的边缘加速服务众智云。
              </pre>
            </dd>
          </dl>
          <dl>
            <dt>{t('姓名')}</dt>
            <dd>李明界/</dd>
          </dl>
          <dl>
            <dt>{t('办公邮箱')}</dt>
            <dd>info@crancloud.com</dd>
          </dl>
          <dl>
            <dt>{t('手机号')}</dt>
            <dd>18910298984</dd>
          </dl>
          <dl>
            <dt>{t('开户银行')}</dt>
            <dd>北京市 朝阳区 建国路 支行</dd>
          </dl>
          <dl>
            <dt>{t('开户名')}</dt>
            <dd>王磊</dd>
          </dl>
          <dl>
            <dt>{t('账号')}</dt>
            <dd>6334 **** **** 2030</dd>
          </dl>
        </div>
      </Card>
    );
  }
}
