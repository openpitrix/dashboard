import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { translate } from 'react-i18next';
import _ from 'lodash';

import { Icon } from 'components/Base';
import { versionTypes, getVersionTypesName } from 'config/version-types';

import styles from './index.scss';

@translate()
@observer
export default class Versions extends React.Component {
  static propTypes = {
    typeVersions: PropTypes.array
  };

  static defaultProps = {
    typeVersions: []
  };

  render() {
    const { typeVersions, t } = this.props;
    const types = typeVersions.map(item => item.type);

    return (
      <div className={styles.versions}>
        <table className={styles.versionTable}>
          <thead>
            <tr>
              <th>{t('Delivery type')}</th>
              <th>{t('Name')}</th>
              <th>{t('Update Log')}</th>
            </tr>
          </thead>

          <tbody>
            {types.map(type => {
              const versions = (_.find(typeVersions, { type }) || {}).versions || [];

              return (
                <Fragment key={type}>
                  {versions.map((version, index) => (
                    <tr key={version.version_id}>
                      {index === 0 && (
                        <td rowSpan={versions.length}>
                          <div className={styles.type}>
                            {getVersionTypesName(type) || t('None')}
                          </div>
                          <div className={styles.intro}>
                            {t(
                              (_.find(versionTypes, { value: type }) || {})
                                .intro
                            )}
                          </div>
                        </td>
                      )}
                      <td className={styles.name}>{version.name}</td>
                      <td>
                        <pre>{version.description || t('None')}</pre>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
