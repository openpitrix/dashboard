import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.scss';
import Button from 'components/Base/Button';

const TodoList = ({ labels = [], onRemove }) => {
  return (
    <ul className={styles.list}>
      {labels.map(label => {
        return (
          <li className={styles.item} key={label.label_key}>
            <span>{label.label_key + ': ' + label.label_value}</span>
            <Button className={styles.removeBtn} onClick={onRemove.bind(null, label.label_key)}>
              Remove
            </Button>
          </li>
        );
      })}
    </ul>
  );
};

TodoList.propTypes = {
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      label_key: PropTypes.string.isRequired,
      label_value: PropTypes.string.isRequired
    })
  ),
  onRemove: PropTypes.func
};

TodoList.defaultProps = {
  onRemove: () => {}
};

export default TodoList;
