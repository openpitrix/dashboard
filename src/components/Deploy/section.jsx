import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import { Radio, Input, Select, Slider, CodeMirror } from 'components/Base';

import styles from './index.scss';

export default class Section extends React.Component {
  static propTypes = {
    detail: PropTypes.shape({
      defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
      description: PropTypes.string,
      keyName: PropTypes.string.isRequired, // key is reserved by react
      label: PropTypes.string,
      required: PropTypes.bool,
      type: PropTypes.string.isRequired,
      renderType: PropTypes.string,
      items: PropTypes.array
    }),
    className: PropTypes.string,
    onChange: PropTypes.func,
    onEmpty: PropTypes.func
  };

  static defaultProps = {
    detail: {
      description: '',
      keyName: '',
      label: '',
      required: false,
      type: 'string'
    }
  };

  state = {
    value: null
  };

  handleChange = val => {
    const { keyName, renderType } = this.props.detail;

    if (typeof val === 'object' && val.nativeEvent) {
      // react event object
      val = val.currentTarget.value;
    }

    this.setState({ value: val });

    // todo: unify onChange
    // console.log(`change [${renderType}] ${keyName}: `, val);
    this.props.onChange(keyName, val);
  };

  getDefaultValue() {
    const { defaultValue, ...rest } = this.props.detail;

    if (!defaultValue) {
      if (Array.isArray(rest.range)) {
        return _.isObject(rest.range[0]) ? _.get(rest.range[0], 'value') : rest.range[0];
      }
      if (Array.isArray(rest.items)) {
        return _.get(rest.items[0], 'value');
      }
    }

    return defaultValue;
  }

  getValue() {
    const { value } = this.state;

    return value !== null ? value : this.getDefaultValue();
  }

  getNumbericValue() {
    const val = parseInt(this.getValue());
    return Number.isNaN(val) ? 0 : val;
  }

  formatLabel = (value, key) => {
    let name = '';
    switch (key) {
      case 'cpu':
        name = value + ' Core';
        break;
      case 'memory':
        name = value / 1024 + ' GB';
        break;
      case 'instance_class':
        name = value === 0 ? 'High Performance' : 'Super-high Performance';
        break;
      default:
        name = value.toString();
        break;
    }
    return name;
  };

  renderLabel() {
    const { keyName, label, renderType } = this.props.detail;

    return (
      <label
        className={classnames(styles.label, {
          [styles.isRadio]: renderType === 'radio',
          [styles.isYamlLabel]: renderType === 'yaml'
        })}
      >
        {label || keyName}
      </label>
    );
  }

  renderItem() {
    const {
      renderType,
      description,
      defaultValue,
      keyName,
      originKey,
      items,
      required,
      ...rest
    } = this.props.detail;

    // hook: render content for empty items
    if (renderType === 'radio' && _.isEmpty(rest.range)) {
      return this.props.onEmpty(keyName);
    }

    let content = null;

    switch (renderType) {
      case 'input':
        content = (
          <Fragment>
            <Input
              className={styles.input}
              name={keyName}
              type="text"
              defaultValue={defaultValue}
              maxLength={50}
              onChange={this.handleChange}
              required={required}
            />
            <p className={styles.tips}>{description}</p>
          </Fragment>
        );
        break;

      case 'number':
        content = (
          <Fragment>
            <Input
              className={styles.input}
              name={keyName}
              type="number"
              defaultValue={defaultValue}
              onChange={this.handleChange}
              min={rest.min}
              max={rest.max}
              required={required}
            />
            <p className={styles.tips}>
              Range: {rest.min} - {rest.max}
            </p>
          </Fragment>
        );
        break;

      case 'radio':
        content = (
          <Radio.Group
            className={styles.radio}
            defaultValue={this.getDefaultValue()}
            onChange={this.handleChange}
            name={keyName}
            value={this.getValue()}
          >
            {rest.range.map((item, idx) => {
              let value = '';
              if (_.isObject(item)) {
                value = item.value;
              } else {
                value = item;
              }

              return (
                <Radio value={value} key={idx}>
                  {this.formatLabel(value, originKey)}
                </Radio>
              );
            })}
          </Radio.Group>
        );
        break;

      case 'select':
        content = (
          <Select
            className={styles.select}
            defaultValue={this.getDefaultValue()}
            onChange={this.handleChange}
            disabled={items.length === 0}
            name={keyName}
            value={this.getValue()}
          >
            {items.map(({ name, value }, idx) => (
              <Select.Option key={idx} value={value}>
                {name + ''}
              </Select.Option>
            ))}
          </Select>
        );
        break;

      case 'text':
        content = (
          <textarea
            className={styles.text}
            name={keyName}
            defaultValue={defaultValue}
            maxLength={1000}
            onChange={this.handleChange}
          />
        );
        break;

      case 'slider':
        content = (
          <Fragment>
            <Slider
              min={rest.min}
              max={rest.max}
              step={rest.step}
              value={this.getNumbericValue()}
              onChange={this.handleChange}
              className={styles.slider}
            />
            <span className={styles.sliderInput}>
              <Input
                className={styles.inputSmall}
                type="number"
                name={keyName}
                value={this.getValue()}
                min={rest.min}
                max={rest.max}
                onChange={this.handleChange}
              />{' '}
              GB
            </span>
            <p className={styles.tips}>
              {`${rest.min}GB - ${rest.max}GB, The volume size for each instance`}
            </p>
          </Fragment>
        );
        break;

      case 'yaml':
        content = rest.yaml && (
          <CodeMirror code={rest.yaml} onChange={this.handleChange} name={keyName} />
        );
        break;

      default:
        break;
    }

    return content;
  }

  render() {
    const { className, detail } = this.props;

    return (
      <div className={classnames(styles.row, className)}>
        {this.renderLabel()}
        <div
          className={classnames(styles.item, {
            [styles.editorWrap]: detail.renderType === 'yaml'
          })}
        >
          {this.renderItem()}
        </div>
      </div>
    );
  }
}
