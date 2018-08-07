import React from 'react';
import PropTypes from 'prop-types';
import ClipboardJS from 'clipboard';
import { observer, inject } from 'mobx-react';
import { translate } from 'react-i18next';

import { Icon } from 'components/Base';
import styles from './index.scss';

@translate()
@inject('rootStore')
@observer
export default class CopyId extends React.Component {
  static propTypes = {
    id: PropTypes.string
  };

  componentDidMount() {
    const { t } = this.props;

    this.clipboard = new ClipboardJS(this.refs.copyBtn);

    this.clipboard.on('success', e => {
      this.props.rootStore.notify({ message: t('Copy success'), type: 'success' });
      e.clearSelection();
    });
  }

  componentWillUnmount() {
    this.clipboard && this.clipboard.destroy();
  }

  render() {
    const { id } = this.props;

    return (
      <div className={styles.copyOuter}>
        id: {id}
        <span className="copyId" data-clipboard-text={id} ref="copyBtn">
          <Icon name="copy" type="dark" />
        </span>
      </div>
    );
  }
}
