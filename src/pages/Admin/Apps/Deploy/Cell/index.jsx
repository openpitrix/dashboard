import React, { PureComponent, Fragment } from 'react';
import { Radio, Button, Input, Select, Slider } from 'components/Base';
import PropTypes from 'prop-types';

import styles from './index.scss';
import classNames from 'classnames';

export default class Cell extends PureComponent {
  static propTypes = {
    config: PropTypes.object,
    className: PropTypes.string,
    type: PropTypes.oneOf(['basic', 'node', 'env']),
    configIndex1: PropTypes.number,
    configIndex2: PropTypes.number,
    changeCell: PropTypes.func
  };

  changeCell = value => {
    const config = this.props.config;
    const params = {
      type: this.props.type,
      index1: this.props.configIndex1,
      index2: this.props.configIndex2
    };
    this.props.changeCell(value, config, params);
  };
  changeCellInput = event => {
    const value = event.target.value;
    const config = this.props.config;
    const params = {
      type: this.props.type,
      index1: this.props.configIndex1,
      index2: this.props.configIndex2
    };
    this.props.changeCell(value, config, params);
  };

  getName = (value, key) => {
    let name = '';
    switch (key) {
      case 'cpu':
        name = value + '-Core';
        break;
      case 'memory':
        name = value / 1024 + ' GB';
        break;
      case 'instance_class':
        name = value == 0 ? 'High Performance' : 'Super-high Performance';
        break;
      default:
        name = value.toString();
        break;
    }
    return name;
  };

  render() {
    const { config, className } = this.props;
    const isRadio = config.range;
    const isSlider = config.step;
    const isNumberInput = config.type === 'integer' && !config.step && (config.max || config.min);
    const isDescription = config.key === 'description';
    const isStringInput = config.type === 'string' && !config.range && config.key !== 'description';
    const inputName = isNumberInput || isStringInput;
    return (
      <div className={classNames(styles.cell, className)}>
        <label className={classNames(styles.name, { [styles.inputName]: inputName })}>
          {config.label}
        </label>
        {isRadio && (
          <Radio.Group
            className={styles.showWord}
            value={config.default}
            onChange={this.changeCell}
          >
            {config.range &&
              config.range.map(data => (
                <Radio value={data} key={data}>
                  {this.getName(data, config.key)}
                </Radio>
              ))}
          </Radio.Group>
        )}
        {isSlider && (
          <Fragment>
            <Slider
              min={config.min}
              max={config.max}
              step={config.step}
              value={config.default}
              onChange={this.changeCell}
            />
            <span>
              <Input
                className={styles.inputSmall}
                type="number"
                name={config.key}
                value={config.default}
                onChange={this.changeCellInput}
              />{' '}
              GB
            </span>
            <p className={classNames(styles.rightShow, styles.note)}>
              {config.min}GB - {config.max}GB, The volume size for each instance
            </p>
          </Fragment>
        )}
        {isNumberInput && (
          <Fragment>
            <Input
              className={styles.input}
              name={config.key}
              type="number"
              value={config.default}
              onChange={this.changeCell}
              data-min={config.min}
              data-max={config.max}
            />
            <p className={classNames(styles.rightShow, styles.note)}>
              Range: {config.min} - {config.max}
            </p>
          </Fragment>
        )}
        {isDescription && (
          <textarea
            className={styles.textarea}
            name={config.key}
            value={config.default}
            onChange={this.changeCell}
          />
        )}
        {isStringInput && (
          <Fragment>
            <Input
              className={styles.input}
              name={config.key}
              type="text"
              value={config.default}
              onChange={this.changeCell}
            />
            <p className={classNames(styles.rightShow, styles.note)}>{config.description}</p>
          </Fragment>
        )}
      </div>
    );
  }
}
