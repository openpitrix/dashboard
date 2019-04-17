import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default function WarpField(WrappedComponent) {
  if (!WrappedComponent) return null;
  const displayName = `Filed-${WrappedComponent.displayName
    || WrappedComponent.name
    || 'unkown'}`;

  class Field extends PureComponent {
    static displayName = displayName;

    static propTypes = {
      className: PropTypes.string,
      label: PropTypes.string,
      layout: PropTypes.oneOf(['horizon', 'vertical', 'inline'])
    };

    static defaultProps = {
      layout: 'horizon'
    };

    renderLabel() {
      const { label, name } = this.props;
      if (!label) {
        return null;
      }

      return <label htmlFor={name}>{label}</label>;
    }

    renderContent() {
      const {
        name,
        label,
        iconLeft,
        iconRight,
        validateStatus,
        validateIcon,
        ...restProps
      } = this.props;

      return <WrappedComponent {...restProps} name={name} id={name} />;
    }

    renderHelp() {
      const { help } = this.props;
      if (!help) {
        return null;
      }
      return <div className={styles.help}>{help}</div>;
    }

    render() {
      const { layout, name } = this.props;
      if (!name) {
        return null;
      }

      return (
        <div className={classnames(styles.field, styles[layout])}>
          {this.renderLabel()}
          {this.renderContent()}
          {this.renderHelp()}
        </div>
      );
    }
  }

  return Field;
}
