import React, { PureComponent, Fragment } from 'react';
import { Radio, Button, Input, Select, Slider } from 'components/Base';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.scss';

export default class YamlCell extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.any,
    index: PropTypes.number,
    changeCell: PropTypes.func,
    className: PropTypes.string
  };

  static defaultProps = {
    value: ''
  };

  changeCell = value => {
    this.props.changeCell(value, this.props.name, this.props.index);
  };
  changeCellInput = event => {
    const value = event.target.value;
    this.props.changeCell(value, this.props.name, this.props.index);
  };

  render() {
    const { name, value, className } = this.props;
    const isRadio = typeof value === 'boolean';

    return (
      <div className={classNames(styles.cell, className)}>
        <label className={classNames(styles.name, styles.inputName)} title={name}>
          {name}
        </label>

        {!isRadio && (
          <Input
            className={styles.input}
            name={name}
            type="text"
            value={value}
            onChange={this.changeCellInput}
          />
        )}
        {isRadio && (
          <Radio.Group className={styles.showWord} value={value} onChange={this.changeCell}>
            <Radio value={true}>true</Radio>
            <Radio value={false}>false</Radio>
          </Radio.Group>
        )}
      </div>
    );
  }
}
