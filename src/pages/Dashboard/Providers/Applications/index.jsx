import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import classnames from 'classnames';

import { Table } from 'components/Base';
import Layout from 'components/Layout';
import Status from 'components/Status';

import providers from '../mock/applications';

import styles from './index.scss';

const types = [
  { name: 'Processed', value: 'processed' },
  { name: 'Unprocessed', value: 'unprocessed' }
];

@translate()
@inject(({ rootStore }) => ({
  rootStore
}))
@observer
export default class Applications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeType: 'processed'
    };
  }

  async componentDidMount() {}

  changeType = type => {
    const { activeType } = this.state;

    if (type !== activeType) {
      this.setState({ activeType: type });
    }
  };

  render() {
    const { t } = this.props;

    const columns = [
      {
        title: t('申请编号'),
        key: 'number',
        width: '80px',
        render: item => (
          <Link to={`/dashboard/application/${item.number}`}>
            {item.number}
          </Link>
        )
      },
      {
        title: t('审核结果'),
        key: 'status',
        width: '80px',
        render: item => <Status type={item.status} name={item.status} />
      },
      {
        title: t('公司名称、介绍'),
        key: 'company',
        width: '200px',
        render: item => (
          <div className={styles.company}>
            <div className={styles.name}>{item.company}</div>
            <div className={styles.introduce}>{item.introduce}</div>
          </div>
        )
      },
      {
        title: t('公司官网'),
        key: 'home',
        width: '120px',
        render: item => item.home
      },
      {
        title: t('审核时间'),
        key: 'audit_time',
        width: '100px',
        render: item => item.audit_time
      },
      {
        title: t('审核人员'),
        key: 'auditor',
        width: '120px',
        render: item => item.auditor
      },
      {
        title: '',
        key: 'actions',
        width: '80px',
        className: 'actions',
        render: item => (
          <div className={styles.actions}>
            <Link to={`/dashboard/application/${item.number}`}>
              {t('查看详情')} →
            </Link>
          </div>
        )
      }
    ];

    const pagination = {
      total: 6,
      current: 1
    };

    const { activeType } = this.state;

    return (
      <Layout pageTitle={t('入驻申请')}>
        <div className={styles.types}>
          {types.map(type => (
            <label
              key={type.value}
              onClick={() => this.changeType(type.value)}
              className={classnames({
                [styles.active]: activeType === type.value
              })}
            >
              {t(type.name)}
            </label>
          ))}
        </div>

        <Table
          columns={columns}
          dataSource={providers}
          pagination={pagination}
        />
      </Layout>
    );
  }
}
