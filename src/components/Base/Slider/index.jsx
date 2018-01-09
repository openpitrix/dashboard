import { isFunction, clamp } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class Slider extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
    onChange: PropTypes.func,
    value: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
  }

  static defaultProps = {
    className: '',
    min: 0,
    max: 100,
    step: 1,
    value: 0,
  }

  constructor(props) {
    super(props);

    this.state = {
      maxPos: 0,
    };
  }

  componentDidMount() {
    if (!this.slider || !this.block) {
      return;
    }
    const sliderWidth = this.slider.offsetWidth;
    const blockWidth = this.block.offsetWidth;
    this.setState({
      maxPos: sliderWidth - blockWidth,
    });
  }

  getValue = pos => {
    const { maxPos } = this.state;
    const { min, max, step } = this.props;

    if (!maxPos) return 0;

    const percent = clamp(pos, 0, maxPos) / maxPos;
    const value = Math.round(percent * (max - min) / step) * step + min;

    return value;
  };

  getPosition = value => {
    const { maxPos } = this.state;
    const { min, max } = this.props;

    return Math.round((value - min) / (max - min) * maxPos);
  };

  handleStart = () => {
    document.addEventListener('mousemove', this.handleMove);
    document.addEventListener('mouseup', this.handleEnd);
  };

  handleMove = e => {
    e.stopPropagation();

    const pos = e.clientX - this.slider.getBoundingClientRect().left;
    const value = this.getValue(pos);

    if (isFunction(this.props.onChange)) {
      this.props.onChange(value);
    }
  };

  handleEnd = () => {
    document.removeEventListener('mousemove', this.handleMove);
    document.removeEventListener('mouseup', this.handleEnd);
  }

  render() {
    const { className, value } = this.props;

    const position = this.getPosition(value);
    const barStyle = { width: position };
    const blockStyle = { left: position };

    return (
      <div
        ref={(ref) => { this.slider = ref; }}
        className={classnames(styles.slider, className)}
        onMouseDown={this.handleMove}
        onMouseUp={this.handleEnd}
      >
        <div
          className={styles.bar}
          style={barStyle}
        />
        <div
          ref={(ref) => { this.block = ref; }}
          className={styles.block}
          style={blockStyle}
          onMouseDown={this.handleStart}
        />
      </div>
    );
  }
}
