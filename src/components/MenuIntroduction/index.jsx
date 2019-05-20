import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Button } from 'components/Base';
import styles from './index.scss';

export default class MenuIntroduction extends PureComponent {
  static propTypes = {
    activeIndex: PropTypes.number,
    changeIntroduction: PropTypes.func,
    className: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    total: PropTypes.number
  };

  render() {
    const {
      className,
      title,
      description,
      image,
      activeIndex,
      total,
      changeIntroduction
    } = this.props;
    const dots = Array.from(Array(total).keys());
    const left = (activeIndex - 1) * 75;

    return (
      <div>
        <div
          className={classnames(styles.menuIntroduction, className)}
          style={{ left: `${left}px` }}
        >
          <div className={styles.content}>
            <div className={styles.word}>
              <div className={styles.title}>{title}</div>
              <div className={styles.description}>{description}</div>
            </div>

            <img className={styles.image} src={image} />
          </div>

          <div className={styles.footer}>
            {dots.map((dot, index) => (
              <label
                className={classnames(styles.dot, {
                  [styles.active]: activeIndex === index + 1
                })}
                key={index}
              />
            ))}

            <div className="pull-right">
              {activeIndex !== total && (
                <label
                  className={styles.skip}
                  onClick={() => changeIntroduction(true)}
                >
                  跳过
                </label>
              )}
              <Button type="primary" onClick={() => changeIntroduction()}>
                {activeIndex === total ? '全部了解' : '了解'}
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.shadow} />
      </div>
    );
  }
}
