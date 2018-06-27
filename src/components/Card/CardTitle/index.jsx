import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class CardTitle extends PureComponent {
  static propTypes = {
    categoryId: PropTypes.string,
    title: PropTypes.string,
    moreApps: PropTypes.func,
    more: PropTypes.bool
  };

  moreApps = () => {
    const id = this.props.categoryId;
    const title = this.props.title;
    this.props.moreApps({ category_id: id }, title);
  };

  render() {
    const { title, more } = this.props;
    return (
      <div className={classnames(styles.title)}>
        {title}{' '}
        <span className={classnames(styles.more, { [styles.show]: more })} onClick={this.moreApps}>
          more...
        </span>
      </div>
    );
  }
}
