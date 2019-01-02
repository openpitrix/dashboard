import React from 'react';
import { storiesOf } from '@storybook/react';
import { Icon } from 'components/Base';
import icons from 'utils/icons';
import styles from './index.scss';

function getMatches(string, regex, index) {
  index || (index = 1); // default to the first capturing group
  const matches = [];
  let match;
  // eslint-disable-next-line
  while ((match = regex.exec(string))) {
    matches.push(match[index]);
  }

  return matches;
}
const reg = /<symbol id="qui-([a-zA-Z]*)"/g;

storiesOf('Icon', module)
  .add('icon list', () => (
    <div>
      {getMatches(icons, reg, 0).map(m => (
        <p className={styles.p} key={m}>
          <Icon name={m} />
          {m}
        </p>
      ))}
    </div>
  ))
  .add('change size', () => (
    <p className={styles.p}>
      <Icon size={12} name={'add'} />
      <Icon size={16} name={'add'} />
      <Icon size={24} name={'add'} />
    </p>
  ))
  .add('change color style', () => (
    <p className={styles.p}>
      <Icon name={'add'} />
      <Icon type="dark" name={'add'} />
      <Icon className={styles.bgWhite} type="white" name={'add'} />
    </p>
  ));
