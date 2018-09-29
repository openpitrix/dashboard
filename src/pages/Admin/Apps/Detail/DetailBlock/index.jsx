import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { get } from 'lodash';

import { ProviderName } from 'components/TdName';
import { Image, Button } from 'components/Base';
import Status from 'components/Status';
import CopyId from 'components/DetailCard/CopyId';
import { Grid, Section, Card, Panel } from 'components/Layout';
import { mappingStatus } from 'utils';

import styles from './index.scss';

@translate()
export default class DetailBlock extends React.Component {
  static propTypes = {
    appDetail: PropTypes.object.isRequired,
    repoName: PropTypes.string,
    repoProvider: PropTypes.string,
    noDeploy: PropTypes.bool
  };

  render() {
    const { appDetail, repoName, repoProvider, noDeploy, t } = this.props;

    return (
      <div className={styles.detailBlock}>
        <div className={styles.titleOuter}>
          <span className={styles.icon}>
            <Image src={appDetail.icon} alt="Icon" iconSize={32} />
          </span>
          <div className={styles.title}>
            <div className={styles.name}>{appDetail.name}</div>
            <CopyId id={appDetail.app_id} />
          </div>
        </div>
        <div className={styles.detailOuter}>
          <dl>
            <dt>{t('Status')}</dt>
            <dd>
              <Status name={mappingStatus(appDetail.status)} type={appDetail.status} />
            </dd>
          </dl>
          <dl>
            <dt>{t('Latest Version')}</dt>
            <dd>{get(appDetail, 'latest_app_version.name', '')}</dd>
          </dl>
          <dl>
            <dt>{t('Category')}</dt>
            <dd>
              {t(
                get(appDetail, 'category_set', [])
                  .filter(cate => cate.category_id && cate.status === 'enabled')
                  .map(cate => cate.name)
                  .join(', ')
              )}
            </dd>
          </dl>
          <dl>
            <dt>{t('Repo')}</dt>
            <dd>
              <Link to={`/dashboard/repo/${appDetail.repo_id}`}>
                <ProviderName provider={repoProvider} name={repoName} />
              </Link>
            </dd>
          </dl>
        </div>
        {!noDeploy && (
          <Link className={styles.deploy} to={`/store/${appDetail.app_id}/deploy`}>
            <Button type="primary">Deploy</Button>
          </Link>
        )}
      </div>
    );
  }
}
