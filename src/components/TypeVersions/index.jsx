import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { withTranslation } from 'react-i18next';

import { getVersionTypesName } from 'config/version-types';
import _ from 'lodash';

import styles from './index.scss';

@withTranslation()
@observer
export default class TypeVersions extends Component {
  static propTypes = {
    activeType: PropTypes.string,
    activeVersion: PropTypes.string,
    changeType: PropTypes.func,
    className: PropTypes.string,
    types: PropTypes.array,
    versions: PropTypes.array
  };

  static defaultProps = {
    activeType: '',
    activeVersion: '',
    changeType: _.noop,
    types: [],
    versions: []
  };

  changeType(value, type) {
    this.props.changeType(value, type);
  }

  render() {
    const {
      className,
      types,
      versions,
      activeType,
      activeVersion,
      t
    } = this.props;

    return (
      <div className={classnames(styles.typeVersions, className)}>
        <dl>
          <dt>{t('Delivery type')}:</dt>
          <dd>
            <div className={styles.types}>
              {types.map(type => (
                <label
                  key={type}
                  onClick={() => this.changeType(type, 'activeType')}
                  className={classnames({
                    [styles.active]: (activeType || types[0]) === type
                  })}
                >
                  {getVersionTypesName(type) || t('None')}
                </label>
              ))}
            </div>
          </dd>
        </dl>
        <dl>
          <dt>{t('Version No')}:</dt>
          <dd>
            <div className={styles.types}>
              {versions.map(item => (
                <label
                  key={item.version_id}
                  onClick={() => this.changeType(item.version_id, 'activeVersion')
                  }
                  className={classnames({
                    [styles.active]: activeVersion === item.version_id
                  })}
                >
                  {item.name || t('None')}
                </label>
              ))}
            </div>
          </dd>
        </dl>
      </div>
    );
  }
}
