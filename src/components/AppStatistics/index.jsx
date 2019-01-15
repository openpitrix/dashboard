import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import { Card } from 'components/Layout';

import styles from './index.scss';

@translate()
export default class AppStatistics extends Component {
  static propTypes = {
    appTotal: PropTypes.number,
    className: PropTypes.string,
    isAppDetail: PropTypes.bool,
    monthDepoly: PropTypes.number,
    starTotal: PropTypes.number,
    totalDepoly: PropTypes.number,
    versionTotal: PropTypes.number
  };

  static defaultProps = {
    isAppDetail: false,
    appTotal: 0,
    versionTotal: 0,
    monthDepoly: 0,
    totalDepoly: 0,
    starTotal: 5
  };

  render() {
    const {
      className,
      isAppDetail,
      appTotal,
      versionTotal,
      monthDepoly,
      totalDepoly,
      t
    } = this.props;

    return (
      <Card className={classnames(styles.appStatistics, className)}>
        <dl>
          <dt>{t(isAppDetail ? 'Online version' : 'On the shelf apps')}</dt>
          <dd>{isAppDetail ? versionTotal : appTotal}</dd>
        </dl>
        <dl>
          <dt>{t('Deploy times this month')}</dt>
          <dd>{monthDepoly}</dd>
        </dl>
        <dl>
          <dt>{t('Total of deploy')}</dt>
          <dd>{totalDepoly}</dd>
        </dl>
        {/* <dl>
          <dt>{t('Evaluation stars')}</dt>
          <dd>
            {starTotal}
            <label>
              {stars.map(star => (
                <Icon
                  key={star}
                  name="star"
                  size={16}
                  type="dark"
                  className={classnames({
                    [styles.yellow]: starTotal >= star
                  })}
                />
              ))}
            </label>
          </dd>
        </dl> */}
      </Card>
    );
  }
}
