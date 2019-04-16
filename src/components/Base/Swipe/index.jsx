import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import styles from './index.scss';

export default class Swipe extends React.Component {
  static propTypes = {
    autoPlay: PropTypes.bool,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hoverStop: PropTypes.bool,
    showDots: PropTypes.bool,
    speed: PropTypes.number,
    unit: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    autoPlay: true,
    hoverStop: true,
    showDots: true,
    speed: 5000,
    width: '100vw',
    height: '100vh',
    unit: 'px'
  };

  state = {
    hasTransition: false,
    current: 1
  };

  componentDidMount() {
    if (this.props.autoPlay) {
      this.play();
    }
  }

  componentWillUnmount() {
    this.pause();
  }

  get hasChildren() {
    return this.props.children && this.props.children.length > 0;
  }

  get total() {
    return this.props.children.length;
  }

  get widthNumber() {
    const { width } = this.props;
    if (_.isNumber(width)) {
      return width;
    }
    return parseFloat(width);
  }

  get widthUnit() {
    const { width, unit } = this.props;
    if (_.isNumber(width)) {
      return unit;
    }

    return _.last(width.split(/\d./));
  }

  get width() {
    return `${this.widthNumber}${this.widthUnit}`;
  }

  get height() {
    const { height, unit } = this.props;
    if (_.isNumber(height)) {
      return `${height}${unit}`;
    }
    return height;
  }

  get totalWidth() {
    const total = this.total + 2;
    return `${this.widthNumber * total}${this.widthUnit}`;
  }

  get transform() {
    const { current } = this.state;
    const translateX = `${current * -1 * this.widthNumber}${this.widthUnit}`;
    return `translateX(${translateX})`;
  }

  changeIndex = (plusNum, idx = null) => {
    let { current } = this.state;
    const { total } = this;
    let next = null;
    if (_.isNumber(plusNum)) {
      current += plusNum;
    } else if (_.isNumber(idx)) {
      current = idx;
    }
    if (current >= total + 1) {
      current = total + 1;
      next = 1;
    } else if (current <= 0) {
      current = 0;
      next = total;
    }
    this.setState({
      hasTransition: true,
      current
    });
    if (next) {
      setTimeout(() => {
        this.setState({
          hasTransition: false,
          current: next
        });
      }, 500);
    }
  };

  play = () => {
    this.interval = setInterval(() => this.changeIndex(1), this.props.speed);
  };

  pause = () => {
    clearInterval(this.interval);
  };

  renderDots() {
    if (!this.props.showDots) return null;

    return (
      <Fragment>
        {_.range(this.total).map(index => (
          <span
            key={index}
            onClick={() => this.changeIndex(null, index + 1)}
            className={classnames(
              styles.dot,
              {
                [styles.active]: this.state.current - 1 === index
              },
              this.props.dotCls
            )}
          />
        ))}
      </Fragment>
    );
  }

  renderContent() {
    const { children, contentCls } = this.props;
    const appendedChildren = [
      children[children.length - 1],
      ...children,
      children[0]
    ];

    return React.Children.map(appendedChildren, (child, idx) => {
      const childClone = React.cloneElement(child);

      return (
        <div
          className={classnames(styles.content, contentCls)}
          style={{ width: this.width }}
          key={`swipe-${child.key}-${idx}`}
        >
          {childClone}
        </div>
      );
    });
  }

  render() {
    const {
      className, hoverStop, contentOuter, dotsOuter
    } = this.props;
    const { hasTransition } = this.state;

    if (!this.hasChildren) {
      return null;
    }
    return (
      <div
        className={classnames(styles.container, className)}
        onMouseEnter={hoverStop ? this.pause : _.noop}
        onMouseLeave={hoverStop ? this.play : _.noop}
        style={{ height: this.height }}
      >
        <div
          className={classnames(
            styles.contentOuter,
            {
              [styles.contentTransition]: hasTransition
            },
            contentOuter
          )}
          style={{
            width: this.totalWidth,
            transform: this.transform
          }}
        >
          {this.renderContent()}
        </div>
        <div className={classnames(styles.dotsOuter, dotsOuter)}>
          {this.renderDots()}
        </div>
      </div>
    );
  }
}
