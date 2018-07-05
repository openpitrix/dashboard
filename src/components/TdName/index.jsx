import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ClipboardJS from 'clipboard';

import styles from './index.scss';

export default class TdName extends PureComponent {
  static propTypes = {
    image: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    linkUrl: PropTypes.string
  };

  render() {
    const { image, name, description, linkUrl } = this.props;
    var clipboard = new ClipboardJS('.fa-clipboard');
    clipboard.on('success', function(e) {
      e.clearSelection();
    });

    return (
      <span className={styles.tdName}>
        {image && <img src={image} className={styles.image} />}
        <span className={styles.info}>
          {linkUrl && (
            <Link className={styles.name} to={linkUrl} title={name}>
              {name}
            </Link>
          )}
          {!linkUrl && (
            <span className={styles.name} title={name}>
              {name}
            </span>
          )}
          <span className={styles.description}>{description}</span>
          <i className="fa fa-clipboard" data-clipboard-text={description} />
        </span>
      </span>
    );
  }
}
