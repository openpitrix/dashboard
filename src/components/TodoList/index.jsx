import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';
import Input from 'components/Base/Input';
import Button from 'components/Base/Button';

export default class TodoList extends PureComponent {
  static propTypes = {
    labelType: PropTypes.oneOf(['label', 'selector']),
    labels: PropTypes.arrayOf(
      PropTypes.shape({
        label_key: PropTypes.string.isRequired,
        label_value: PropTypes.string.isRequired
      })
    ),
    onRemove: PropTypes.func,
    changeLabel: PropTypes.func
  };

  onRemove = () => {
    this.props.onRemove();
  };

  changeLabel = (event, index, type) => {
    const value = event.target.value;
    this.props.changeLabel(value, index, type, this.props.labelType);
  };

  render() {
    const { labels } = this.props;
    return (
      <ul className={styles.list}>
        {labels.map((label, index) => {
          return (
            <li className={styles.item} key={index}>
              <Input
                className={styles.inputSmall}
                placeholder="Key"
                value={label.label_key}
                onChange={e => {
                  this.changeLabel(e, index, 'key');
                }}
              />
              <Input
                className={styles.inputSmall}
                placeholder="Value"
                value={label.label_value}
                onChange={e => {
                  this.changeLabel(e, index, 'value');
                }}
              />
              {index === labels.length - 1 &&
                index !== 0 && (
                  <Button className={styles.removeBtn} onClick={this.onRemove}>
                    Remove
                  </Button>
                )}
            </li>
          );
        })}
      </ul>
    );
  }
}
