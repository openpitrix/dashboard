import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class FormItem extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
    title: PropTypes.string,
    formData: PropTypes.object,
  }

  static defaultProps = {
    className: '',
  }

  render() {
    const { className, children, title, formData } = this.props;

    const classNames = classnames(styles.section, className);

    const childNodes = React.Children.map(children, child => React.cloneElement(child, {
      ...child.props, formData }));

    return (
      <div className={classNames}>
        <p className={styles.sectionTitle}>{title}</p>
        {childNodes}
      </div>
    );
  }
}
