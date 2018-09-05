import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { capitalize, keys, values } from 'lodash';
import { I18n } from 'react-i18next';

import { isArray } from 'src/utils/types';
import { plural } from 'src/utils/plural';

import styles from './index.scss';

const normalizeLink = (link, prefix = '') => {
  if (link.startsWith('/')) {
    link = link.substring(1);
  }

  link = link ? `${prefix}/${link}` : prefix;
  // always prefix with slash
  if (!link.startsWith('/')) {
    link = `/${link}`;
  }

  return link;
};

const isLinkActive = (curLink, match, location) => {
  const { pathname } = location;

  if (curLink === '/dashboard') {
    return curLink === pathname;
  }
  if (curLink === '/profile') {
    return curLink === pathname;
  } else {
    let try_match = pathname.indexOf(curLink) === 0;
    if (!try_match) {
      let prefix = '/dashboard/';
      let suffix = curLink.substring(prefix.length);
      try_match = pathname.indexOf(prefix + plural[suffix]) === 0;
    }
    return try_match;
  }
};

const LinkItem = ({ link, label }) => {
  if (link.indexOf('/profile/ssh_keys') === -1) {
    label = capitalize(label);
  }

  return (
    <I18n>
      {t => (
        <li>
          <NavLink
            to={link}
            activeClassName={styles.active}
            exact
            isActive={isLinkActive.bind(null, link)}
          >
            {t(label)}
          </NavLink>
        </li>
      )}
    </I18n>
  );
};

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
              let label;
              if (typeof link === 'string') {
                label = link.substring(link.lastIndexOf('/') + 1);
              } else if (typeof link === 'object') {
                label = values(link)[0];
                link = keys(link)[0];
              }
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
