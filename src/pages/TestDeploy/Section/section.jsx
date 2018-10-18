import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';

import { Radio, Input, Select, Slider } from 'components/Base';

import styles from './index.scss';

export default class Section extends React.Component {
  static propTypes = {
    detail: PropTypes.shape({
      defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      description: PropTypes.string,
      keyName: PropTypes.string.isRequired, // key is reserved by react
      label: PropTypes.string,
      required: PropTypes.bool,
      type: PropTypes.string.isRequired,
      renderType: PropTypes.string,
      items: PropTypes.array
    }),
    className: PropTypes.string
  };

  static defaultProps = {
    detail: {
      defaultValue: '',
      description: '',
      keyName: '',
      label: '',
      required: false,
      type: 'string'
    }
  };

  handleChange = val => {
    const { keyName, renderType } = this.props.detail;

    if (typeof val === 'object' && val.nativeEvent) {
      // react event object
      val = val.currentTarget.value;
    }

    // todo: unify onChange
    console.log(`change ${renderType}- ${keyName}: `, val);
  };

  renderLabel() {
    const { keyName, label, renderType } = this.props.detail;

    return (
      <label
        className={classnames(styles.label, {
          [styles.isRadio]: renderType === 'radio'
        })}
      >
        {_.capitalize(label || keyName)}
      </label>
    );
  }

  renderItem() {
    const {
      renderType,
      description,
      defaultValue,
      keyName,
      items,
      required,
      ...rest
    } = this.props.detail;

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
            value={defaultValue === undefined ? rest.range[0] : defaultValue}
            onChange={this.handleChange}
            name={keyName}
          >
            {rest.range.map((item, idx) => (
              <Radio value={item} key={idx}>
                {item}
              </Radio>
            ))}
          </Radio.Group>
        );
        break;

      case 'select':
        // todo
        content = (
          <Select
            className={styles.select}
            value={defaultValue}
            onChange={this.handleChange}
            disabled={items.length === 0}
          >
            {items.map(({ version_id, name }) => (
              <Select.Option key={version_id} value={version_id}>
                {name}
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
              defaultValue={defaultValue}
              onChange={this.handleChange}
              className={styles.slider}
            />
            <span className={styles.sliderInput}>
              <Input
                className={styles.inputSmall}
                type="number"
                name={keyName}
                defaultValue={defaultValue}
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

      default:
        break;
    }

    return content;
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classnames(styles.row, className)}>
        {this.renderLabel()}
        <div className={styles.item}>{this.renderItem()}</div>
      </div>
    );
  }
}
