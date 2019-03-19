import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Translation } from 'react-i18next';

import {
  Grid, Section, Panel, Card
} from 'components/Layout';

import styles from './index.scss';

const CreateResource = ({
  className,
  children,
  title,
  footer,
  aside,
  asideTitle,
  ...rest
}) => (
  <Grid className={classnames(styles.wrapper, className)} {...rest}>
    <Section size={8}>
      <Panel className={styles.main}>
        <div className={styles.title}>{title}</div>
        <Card className={styles.card}>{children}</Card>
        <div className={styles.footer}>{footer}</div>
      </Panel>
    </Section>

    {aside && (
      <Section className={styles.aside}>
        <div className={styles.title}>
          <Translation>{t => <span>{t(asideTitle)}</span>}</Translation>
        </div>
        <div className={styles.content}>{aside}</div>
      </Section>
    )}
  </Grid>
);

CreateResource.propTypes = {
  aside: PropTypes.node,
  asideTitle: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  footer: PropTypes.node,
  title: PropTypes.string
};

CreateResource.defaultProps = {
  asideTitle: 'Guide',
  aside: null,
  footer: null
};

export default CreateResource;
