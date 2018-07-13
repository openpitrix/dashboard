import React, { PureComponent } from 'react';
import trans, { __ } from 'hoc/trans';

import styles from './index.scss';

@trans()
export default class Footer extends PureComponent {
  getCurrentLocale = () => {
    return typeof window !== 'undefined' && localStorage.getItem('i18nextLng');
  };

  changeLocale = (lang, e) => {
    e.preventDefault();
    if (this.getCurrentLocale() !== lang) {
      this.props.i18n.changeLanguage(lang);
    }
  };

  render() {
    return (
      <div className={styles.footer}>
        <div className={styles.wrapper}>
          <span className={styles.logo}>
            <img src="/assets/logo_grey.svg" alt="logo" height="100%" />
          </span>
          <ul className={styles.terms}>
            <li>
              <a href="#">{__('About')}</a>
            </li>
            <li>
              <a href="#">{__('Help')}</a>
            </li>
            <li>
              <a href="#">{__('Terms')}</a>
            </li>
            <li className={styles.copyright}>OpenPitrix &copy; 2018</li>
            <li>
              <a href="#" onClick={this.changeLocale.bind(null, 'zh')}>
                中文
              </a>
            </li>
            <li>
              <span className={styles.dot} />
            </li>
            <li>
              <a href="#" onClick={this.changeLocale.bind(null, 'en')}>
                English
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
