import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import Section from '../../section';
import Icon from 'components/Base/Icon';

import styles from './index.scss';

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

  state = {
    showOverlay: false,
    currentPic: ''
  };

  handleClickPicture = e => {
    const { pic } = e.currentTarget.dataset;

    this.setState({
      showOverlay: true,
      currentPic: pic
    });
  };

  closeOverlay = () => {
    this.setState({
      showOverlay: false,
      currentPic: ''
    });
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
          <ul className={styles.pictureList} style={{ width: picWidth, left: picLeft }}>
            {pictures.map((pic, idx) => (
              <li className={styles.pictureOuter} key={idx}>
                <div className={styles.picture} data-pic={pic} onClick={this.handleClickPicture}>
                  <img src={pic} />
                </div>
              </li>
            ))}
          </ul>
          <div />
        </div>
      </div>
    );
  }

  renderOverlay(picture) {
    return (
      <div className={styles.overlay}>
        <div className={styles.closeOverlay} onClick={this.closeOverlay}>
          <Icon name="close" size={32} />
        </div>
        <div className={styles.viewCont}>
          <label className={styles.pre}>
            <Icon name="chevron-left" size={36} />
          </label>
          <label className={styles.next}>
            <Icon name="chevron-right" size={36} />
          </label>
          <img src={picture} alt="overlay picture" className={styles.overlayPic} />
        </div>
      </div>
    );
  }

  render() {
    const { t } = this.props;
    const { showOverlay, currentPic } = this.state;

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
        {showOverlay && this.renderOverlay(currentPic)}
      </div>
    );
  }
}
