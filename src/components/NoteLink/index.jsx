import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Translation } from 'react-i18next';

import { Icon } from 'components/Base';

import styles from './index.scss';

const NoteLink = ({
  className, noteWord, linkWord, link
}) => (
  <Translation>
    {t => (
      <div className={classnames(styles.noteLink, className)}>
        <Icon name="exclamation" size={20} className={styles.icon} />
        {t(noteWord)}
        <Link to={link}>{t(linkWord)} →</Link>
      </div>
    )}
  </Translation>
);

NoteLink.propTypes = {
  className: PropTypes.string,
  link: PropTypes.string,
  linkWord: PropTypes.string,
  noteWord: PropTypes.string
};

export default NoteLink;
