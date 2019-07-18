import React from 'react';

import { Image, Icon } from 'components/Base';

import styles from './index.scss';

export default function LoginItem(props) {
  const {
    imgSrc, name, title, description, t, linkTo, linkText
  } = props;
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <Image className={styles.img} src={imgSrc} />
      </div>
      <div className={styles.name}>{t(name)}</div>
      <h1 className={styles.title}>{t(title)}</h1>
      <div className={styles.description}>{t(description)}</div>
      <div>
        <a href={linkTo}>
          {t(linkText || 'Read more')}
          <Icon name="next-icon" />
        </a>
      </div>
    </div>
  );
}
