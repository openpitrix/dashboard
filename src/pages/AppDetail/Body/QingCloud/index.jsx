import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import Section from '../../section';
import styles from './index.scss';
import Icon from 'components/Base/Icon';

@translate()
@observer
export default class QingCloud extends React.Component {
  static defaultProps = {
    app: {},
    pictures: []
  };

  static propTypes = {
    app: PropTypes.object,
    pictures: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    currentPic: PropTypes.number,
    changePicture: PropTypes.func
  };

  changePicture = (type, number) => {
    const { pictures } = this.props;
    this.props.changePicture(type, number, pictures);
  };

  renderSlider() {
    let { currentPic, pictures } = this.props;
    pictures = pictures || [];
    if (typeof pictures === 'string') {
      pictures = pictures.split(',').map(v => v.trim());
    }
    const picWidth = 276 * pictures.length;
    const picLeft = (1 - currentPic) * 276;

    if (!pictures.length) {
      return null;
    }

    return (
      <div className={styles.slider}>
        <label className={styles.pre} onClick={() => this.changePicture('pre')}>
          <Icon name="chevron-left" size={36} />
        </label>
        <label className={styles.next} onClick={() => this.changePicture('next')}>
          <Icon name="chevron-right" size={36} />
        </label>
        <div className={styles.dotList}>
          {pictures.map((data, index) => {
            if ((index + 1) % 2 === 0) {
              return (
                <label
                  key={data}
                  className={classnames(styles.dot, {
                    [styles.active]: currentPic === index
                  })}
                  onClick={() => this.changePicture('dot', index)}
                />
              );
            }
          })}
        </div>
        <div className={styles.listOuter}>
          <ul
            className={styles.pictureList}
            style={{ width: picWidth + 'px', left: picLeft + 'px' }}
          >
            {pictures.map(data => (
              <li className={styles.pictureOuter} key={data}>
                <div className={styles.picture}>
                  <img src={data} />
                </div>
              </li>
            ))}
          </ul>
          <div />
        </div>
      </div>
    );
  }

  render() {
    const { t } = this.props;

    return (
      <div className={styles.body}>
        <Section
          title={t('Introduction')}
          contentClass={styles.description}
          style={{ marginLeft: 0 }}
        >
          {`is the Apache trafodion (the main contribution of the project hatch). Trafodion is the
          open source release of Apache 2014 and became a Apache project in May 2015. In the past
          ten years.`}
        </Section>
        {this.renderSlider()}
      </div>
    );
  }
}
