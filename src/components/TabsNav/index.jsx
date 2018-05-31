import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import capitalize from 'lodash/capitalize';
import { isArray } from 'src/utils/types';

import styles from './index.scss';

const normalizeLink = (link, prefix = '') => {
  if (link.startsWith('/')) {
    link = link.substring(1);
  }
  link = `${prefix}/${link}`;
  // always prefix with slash
  if (!link.startsWith('/')) {
    link = `/${link}`;
  }

  return link;
};

const LinkItem = ({ link, label }) => (
  <li>
    <NavLink to={link} activeClassName={styles.active}>
      {capitalize(label)}
    </NavLink>
  </li>
);

LinkItem.propTypes = {
  link: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

const TabsNav = ({ links, options }) => {
  let prefix = options.prefix || '';

  return (
    <div className={styles.tabs}>
      <ul className={styles.tabsList}>
        {isArray(links)
          ? links.map(link => {
              let label = link.substring(link.lastIndexOf('/') + 1);
              return <LinkItem link={normalizeLink(link, prefix)} label={label} key={label} />;
            })
          : Object.keys(links).map(label => {
              return (
                <LinkItem link={normalizeLink(links[label], prefix)} label={label} key={label} />
              );
            })}
      </ul>
    </div>
  );
};

TabsNav.propTypes = {
  links: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  options: PropTypes.object
};

TabsNav.defaultProps = {
  links: {},
  options: {}
};

export default TabsNav;
