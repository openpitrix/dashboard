import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import { Icon } from 'components/Base';
import { Card } from 'components/Layout';

import styles from './index.scss';

const stars = [1, 2, 3, 4, 5];

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
      starTotal,
      t
    } = this.props;

    return (
      <Card className={classnames(styles.appStatistics, className)}>
        <dl>
          <dt>{t(isAppDetail ? '线上版本' : '已上架应用')}</dt>
          <dd>{isAppDetail ? versionTotal : appTotal}</dd>
        </dl>
        <dl>
          <dt>{t('本月部署次数')}</dt>
          <dd>{monthDepoly}</dd>
        </dl>
        <dl>
          <dt>{t('总部署次数')}</dt>
          <dd>{totalDepoly}</dd>
        </dl>
        {/* <dl>
          <dt>{t('综合评价')}</dt>
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
