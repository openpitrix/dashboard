import React from 'react';
import PropTypes from 'prop-types';
import ClipboardJS from 'clipboard';
import classnames from 'classnames';
import { observer, inject } from 'mobx-react';
import { withTranslation } from 'react-i18next';

import { Icon } from 'components/Base';
import styles from './index.scss';

@withTranslation()
@inject('rootStore')
@observer
export default class CopyId extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    id: PropTypes.string
  };

  componentDidMount() {
    const { t } = this.props;

    this.clipboard = new ClipboardJS(this.copyBtn);

    this.clipboard.on('success', e => {
      this.props.rootStore.notify({
        message: t('Copy success'),
        type: 'success'
      });
      e.clearSelection();
    });
  }

  componentWillUnmount() {
    this.clipboard && this.clipboard.destroy();
  }

  render() {
    const { id, className } = this.props;

    return (
      <div className={classnames(styles.copyOuter, className)}>
        id: {id}
        <span
          className="copyId"
          data-clipboard-text={id}
          ref={node => {
            this.copyBtn = node;
          }}
        >
          <Icon name="copy" type="dark" />
        </span>
      </div>
    );
  }
}
