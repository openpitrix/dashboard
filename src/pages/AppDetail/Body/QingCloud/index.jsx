import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import ReactMarkdown from 'react-markdown';

import Section from '../../section';

import styles from './index.scss';
import Icon from 'components/Base/Icon';

@observer
export default class QingCloud extends React.Component {
  static defaultProps = {
    app: {}
  };

  static propTypes = {
    app: PropTypes.object,
    pictures: PropTypes.array,
    currentPic: PropTypes.number,
    changePicture: PropTypes.func
  };

  changePicture = (type, number) => {
    const { pictures } = this.props;
    this.props.changePicture(type, number, pictures);
  };

  render() {
    const { app, currentPic, pictures } = this.props;
    const picWidth = 276 * pictures.length + 'px';
    const picLeft = (1 - currentPic) * 276 + 'px';
    return (
      <div className={styles.body}>
        <Section title="Introduction" contentClass={styles.description} style={{ marginLeft: 0 }}>
          {`is the Apache trafodion (the main contribution of the project hatch). Trafodion is the
          open source release of Apache 2014 and became a Apache project in May 2015. In the past
          ten years.`}
        </Section>

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
            <ul className={styles.pictureList} style={{ width: picWidth, left: picLeft }}>
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
      </div>
    );
  }
  renderBasic() {}

  renderScreenshots() {}
}
