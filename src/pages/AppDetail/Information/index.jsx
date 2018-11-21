import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { I18n } from 'react-i18next';

import { formatTime } from 'utils';
import { ProviderName } from 'components/TdName';
import Section from '../section';
import styles from './index.scss';

const Information = ({ app, repo }) => {
  const repoName = get(repo, 'name', '');
  const repoProvider = get(repo, 'providers[0]', '');

  return (
    <I18n>
      {t => (
        <Section
          title={t('Information')}
          className={styles.information}
          contentClass={styles.content}
        >
          <dl>
            <dt>{t('Category')}</dt>
            <dd>
              {t(
                get(app, 'category_set', [])
                  .filter(cate => cate.category_id && cate.status === 'enabled')
                  .map(cate => cate.name)
                  .join(', ')
              )}
            </dd>
          </dl>
          <dl>
            <dt>{t('Application ID')}</dt>
            <dd>{app.app_id}</dd>
          </dl>
          <dl>
            <dt>{t('Repo')}</dt>
            <dd>
              <ProviderName
                provider={repoProvider}
                name={repoName}
                className={styles.repoName}
              />
            </dd>
          </dl>
          <dl>
            <dt>{t('Created At')}</dt>
            <dd>{formatTime(app.create_time, 'YYYY-MM-DD HH:mm:ss')}</dd>
          </dl>
        </Section>
      )}
    </I18n>
  );
};

Information.propTypes = {
  app: PropTypes.object,
  repo: PropTypes.object
};

Information.defaultProps = {
  app: {},
  repo: {}
};

export default Information;
