import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './index.scss';
import Input from 'components/Base/Input';
import Button from 'components/Base/Button';

@translate()
export default class TodoList extends PureComponent {
  static propTypes = {
    labelType: PropTypes.oneOf(['label', 'selector']),
    labels: PropTypes.arrayOf(
      PropTypes.shape({
        label_key: PropTypes.string,
        label_value: PropTypes.string
      })
    ),
    onRemove: PropTypes.func,
    changeLabel: PropTypes.func
  };

  onRemove = index => {
    this.props.onRemove(index);
  };

  changeLabel = (event, index, type) => {
    const value = event.target.value;
    this.props.changeLabel(value, index, type, this.props.labelType);
  };

  render() {
    const { labels, t } = this.props;
    return (
      <ul className={styles.list}>
        {labels.map((label, index) => {
          return (
            <li className={styles.item} key={index}>
              <Input
                className={styles.inputSmall}
                placeholder={t('Key')}
                value={label.label_key}
                maxLength="30"
                onChange={e => {
                  this.changeLabel(e, index, 'key');
                }}
              />
              <Input
                className={styles.inputSmall}
                placeholder={t('Value')}
                value={label.label_value}
                maxLength="30"
                onChange={e => {
                  this.changeLabel(e, index, 'value');
                }}
              />
              <Button
                className={styles.removeBtn}
                onClick={() => {
                  this.onRemove(index);
                }}
              >
                {t('Remove')}
              </Button>
            </li>
          );
        })}
      </ul>
    );
  }
}
