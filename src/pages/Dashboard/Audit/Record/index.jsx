import React, { Component, Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import { Icon, Button, Table, Popover, Select, Modal, Image } from 'components/Base';
import Layout, { Dialog, Grid, Row, Section, Card } from 'components/Layout';
import { getObjName, mappingStatus, getFilterObj } from 'utils';

import { records } from './record';
import styles from './index.scss';

@translate()
@inject(({ rootStore }) => ({
  rootStore,
  appVersionStore: rootStore.appVersionStore,
  appStore: rootStore.appStore
}))
@observer
export default class AuditRecord extends Component {
  async componentDidMount() {
    const { appStore, match } = this.props;
    const { appId } = match.params;

    appStore.fetch(appId);
  }

  componentWillUnmount() {
    const { appVersionStore } = this.props;
    appVersionStore.reset();
  }

  render() {
    const { appVersionStore, appStore, t } = this.props;
    const { appDetail } = appStore;
    const statusMap = {
      notStarted: '未开始',
      passed: '已通过',
      processing: '进行中',
      notPassed: '未通过'
    };

    return (
      <Layout className={styles.auditRecord} pageTitle="审核记录详情">
        <Row>
          <Card className={styles.baseInfo}>
            <div className={styles.main}>
              <span className={styles.image}>
                <Image iconLetter={appDetail.name} iconSize={48} src={appDetail.icon} />
              </span>
              <div className={styles.title}>{appDetail.name}</div>
              <div className={styles.word}>
                交付方式：<label className={styles.value}>Helm</label>
                版本：<label className={styles.value}>0.0.1</label>
              </div>
            </div>

            <div className={styles.secondary}>
              <p>申请编号：201810039282092</p>
              <p>提交时间：2018年10月23日 12:22:02</p>
            </div>
          </Card>
        </Row>

        <Row>
          <Grid>
            <Section size={12} className={styles.moduleOuter}>
              {records.map(record => (
                <div
                  key={record.title}
                  className={classnames(styles.module, [styles[record.status]])}
                >
                  <div className={styles.status}>
                    <label>{statusMap[record.status]}</label>
                  </div>
                  <div className={styles.title}>{record.title}</div>

                  <div className={styles.description}>{record.description}</div>
                  <ul className={styles.steps}>
                    {record.process.map(item => (
                      <li key={item.name} className={classnames(styles[item.status])}>
                        <label className={styles.dot} />
                        {item.name}
                        <span className={styles.arrow}>&nbsp;→</span>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.info}>
                    <p>审核人员：{record.auditor}</p>
                    <p>通过时间：{record.passTime}</p>
                  </div>
                </div>
              ))}

              <div className={styles.module}>
                <div className={styles.result}>
                  <Icon name="error" size={36} type="dark" />
                  <div className={styles.title}>审核未通过</div>
                  <div className={styles.reason}>
                    严格测试应用的功能性、稳定性，以及应用的各个信息。
                  </div>
                  <Link to="#">
                    <Button className={styles.view}>查看版本</Button>
                  </Link>
                </div>
              </div>
            </Section>
          </Grid>
        </Row>
      </Layout>
    );
  }
}
