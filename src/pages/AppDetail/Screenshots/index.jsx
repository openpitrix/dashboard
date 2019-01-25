import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { translate } from 'react-i18next';

import { Icon, Image } from 'components/Base';

import styles from './index.scss';

const pictrueWidth = 320;

@translate()
@observer
export default class Screenshots extends React.Component {
  static propTypes = {
    app: PropTypes.object,
    changePicture: PropTypes.func,
    currentPic: PropTypes.number,
    pictures: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
  };

  static defaultProps = {
    app: {},
    pictures: []
  };

  state = {
    showOverlay: false,
    currentPic: ''
  };

  handleClickPicture = e => {
    const { pic } = e.currentTarget.dataset;

    this.setState({
      currentNum: 1,
      showOverlay: true,
      currentPic: pic
    });
  };

  closeOverlay = () => {
    this.setState({
      currentNum: 1,
      showOverlay: false,
      currentPic: ''
    });
  };

  changeOverlayPic = num => {
    const { pictures } = this.props;
    const { currentNum } = this.state;

    let number = currentNum + num;
    if (number < 1) {
      number = 1;
    }
    if (number > pictures.length) {
      number = pictures.length;
    }

    this.setState({
      currentNum: number,
      showOverlay: true,
      currentPic: pictures[number - 1]
    });
  };

  changePicture = (type, number) => {
    const { pictures } = this.props;
    this.props.changePicture(type, number, pictures);
  };

  renderOverlay() {
    const { showOverlay, currentPic } = this.state;

    if (!showOverlay) {
      return null;
    }

    return (
      <div className={styles.overlay}>
        <div className={styles.closeOverlay} onClick={this.closeOverlay}>
          <Icon name="close" size={32} type="dark" />
        </div>
        <div className={styles.viewCont}>
          <label
            className={styles.pre}
            onClick={() => this.changeOverlayPic(-1)}
          >
            <Icon name="chevron-left" size={24} type="dark" />
          </label>
          <label
            className={styles.next}
            onClick={() => this.changeOverlayPic(1)}
          >
            <Icon name="chevron-right" size={24} type="dark" />
          </label>
          <div className={styles.overlayPic}>
            <Image src={currentPic} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { currentPic, t } = this.props;
    let { pictures = [] } = this.props;
    if (typeof pictures === 'string') {
      pictures = pictures.split(',').map(v => v.trim());
    }
    const picWidth = pictrueWidth * pictures.length;
    const picLeft = (1 - currentPic) * pictrueWidth;

    if (pictures.length === 0) {
      return <div className={styles.screenshots}>{t('None')}</div>;
    }

    return (
      <div className={styles.screenshots}>
        <label className={styles.pre} onClick={() => this.changePicture('pre')}>
          <Icon
            className={classnames({
              [styles.prohibited]: currentPic === 1
            })}
            name="chevron-left"
            size={24}
            type="dark"
          />
        </label>
        <label
          className={styles.next}
          onClick={() => this.changePicture('next')}
        >
          <Icon
            className={classnames({
              [styles.prohibited]: currentPic > pictures.length - 2
            })}
            name="chevron-right"
            size={24}
            type="dark"
          />
        </label>
        <div className={styles.dotList}>
          {pictures
            .filter((v, idx) => (idx + 1) % 2 === 1)
            .map((data, index) => (
              <label
                key={data}
                className={classnames(styles.dot, {
                  [styles.active]: (currentPic - 1) / 2 === index
                })}
                onClick={() => this.changePicture('dot', index)}
              />
            ))}
        </div>
        <div className={styles.listOuter}>
          <ul
            className={styles.pictureList}
            style={{ width: picWidth, left: picLeft }}
          >
            {pictures.map((pic, idx) => (
              <li className={styles.pictureOuter} key={idx}>
                <div
                  className={styles.picture}
                  data-pic={pic}
                  onClick={this.handleClickPicture}
                >
                  <Image src={pic} />
                </div>
              </li>
            ))}
          </ul>
        </div>
        {this.renderOverlay()}
      </div>
    );
  }
}
