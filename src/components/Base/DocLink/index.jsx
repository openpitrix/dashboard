import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import links from 'config/doc-link';

@translate()
export default class DocLink extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    isExternal: PropTypes.bool,
    name: PropTypes.string,
    to: PropTypes.string
  };

  static defaultProps = {
    children: null,
    className: '',
    isExternal: true,
    name: ''
  };

  render() {
    const {
      t, to, name, children, className, isExternal
    } = this.props;
    let text = t(`LINK_${name}`);
    const linkTo = to || links[name];
    if (text === `LINK_${name}`) {
      text = linkTo;
    }
    if (children) {
      text = children;
    }
    if (!text) {
      return null;
    }
    if (isExternal) {
      if (!linkTo) {
        throw new Error(
          `You should edit a link url in the file of 'config/doc-links'. name:${name}`
        );
      }
      return (
        <a
          className={className}
          href={linkTo}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text}
        </a>
      );
    }

    return (
      <Link className={className} to={linkTo}>
        {text}
      </Link>
    );
  }
}
