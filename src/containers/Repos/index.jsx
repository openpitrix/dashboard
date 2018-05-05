import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';
import classNames from 'classnames';

import ManageTabs from 'components/ManageTabs';
import Icon from 'components/Base/Icon';
import Button from 'components/Base/Button';
import Input from 'components/Base/Input';
import AppImgs from 'components/Rectangle/AppImgs';
import TagShow from 'components/TagShow';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  repoStore: rootStore.repoStore
}))
@observer
export default class Repos extends Component {
  static async onEnter({ repoStore }) {
    await repoStore.fetchRepos();
  }

  render() {
    const { repoStore } = this.props;
    //const data = toJS(repoStore) || [];
    const imgArray = [
      'http://via.placeholder.com/24x24',
      'http://via.placeholder.com/24x24',
      'http://via.placeholder.com/24x24',
      'http://via.placeholder.com/24x24',
      'http://via.placeholder.com/24x24'
    ];
    const tags = [
      { name: 'database', content: '5 nodes ha IAM112aa' },
      { name: 'CICD', content: '1.3.2' },
      { name: 'apache', content: 'v2.3.1.42' },
      { name: 'database', content: '5 nodes ha IAMdasa' },
      { name: 'CICD', content: 'true' },
      { name: 'apache', content: 'v2.3.1.42' }
    ];
    return (
      <div className={styles.repos}>
        <ManageTabs />
        <div className={styles.container}>
          <div className={styles.pageTitle}>Repos</div>
          <div className={styles.toolbar}>
            <Input.Search className={styles.search} placeholder="Search App Name" />
            <Button className={classNames(styles.buttonRight, styles.ml12)} type="primary">
              Create
            </Button>
            <Button className={styles.buttonRight}>
              <Icon name="refresh" />
            </Button>
          </div>
          <div className={styles.categories}>
            <div className={styles.line}>
              <div className={styles.word}>Public Repos (2)</div>
            </div>
          </div>
          <div className={styles.repoContent}>
            <div className={styles.inner}>
              <div className={styles.cloumn}>
                <div className={styles.titleName}>QingCloud Pek2 Devops Apps</div>
                <div className={styles.description}>
                  Support multiple clouds such as AWS, Azure, Kubernetes, QingCloud, OpenStack,
                  VMWare and so on.
                </div>
              </div>
              <div className={styles.cloumn}>
                <div className={styles.title}>Runtime Provider</div>
                <img src="http://via.placeholder.com/88x22" />
              </div>
              <div className={styles.cloumn}>
                <AppImgs imgArray={imgArray} />
              </div>
              <div className={styles.operation}>...</div>
            </div>
            <TagShow tags={tags} tagStyle="purple2Style" />
          </div>

          <div className={styles.repoContent}>
            <div className={styles.inner}>
              <div className={styles.cloumn}>
                <div className={styles.titleName}>QingCloud Pek2 Devops Apps</div>
                <div className={styles.description}>
                  Support multiple clouds such as AWS, Azure, Kubernetes, QingCloud, OpenStack,
                  VMWare and so on.
                </div>
              </div>
              <div className={styles.cloumn}>
                <div className={styles.title}>Runtime Provider</div>
                <img />
              </div>
              <div className={styles.cloumn}>
                <div className={styles.title}>Apps</div>
              </div>
              <div className={styles.operation}>...</div>
            </div>
            <TagShow tags={tags} tagStyle="purple2Style" />
          </div>
        </div>
      </div>
    );
  }
}
