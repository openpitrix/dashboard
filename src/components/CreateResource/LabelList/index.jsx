import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';
import Button from 'components/Base/Button';

const LabelList = ({ labels = [], onRemove }) => {
  return (
    <ul className={styles.list}>
      {labels.map(label => {
        return (
          <li className={styles.item} key={label.key}>
            <span>{label.key + ': ' + label.value}</span>
            <Button className={styles.removeBtn} onClick={onRemove.bind(null, label.key)}>
              Remove
            </Button>
          </li>
        );
      })}
    </ul>
  );
};

LabelList.propTypes = {
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  onRemove: PropTypes.func
};

LabelList.defaultProps = {
  onRemove: () => {}
};

export default LabelList;
