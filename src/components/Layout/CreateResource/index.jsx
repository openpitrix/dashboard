import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Grid, Section, Panel, Card } from 'components/Layout';

import styles from './index.scss';

const CreateResource = ({ className, children, title, aside, asideTitle, ...rest }) => (
  <Grid className={classnames(styles.wrapper, className)} {...rest}>
    <Section size={8}>
      <Panel className={styles.main}>
        <div className={styles.title}>{title}</div>
        <Card className={styles.card}>{children}</Card>
      </Panel>
    </Section>

    {aside && (
      <Section className={styles.aside}>
        <div className={styles.title}>{asideTitle}</div>
        <div className={styles.content}>{aside}</div>
      </Section>
    )}
  </Grid>
);

CreateResource.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.string,
  aside: PropTypes.node,
  asideTitle: PropTypes.string
};

CreateResource.defaultProps = {
  asideTitle: 'Guide',
  aside: PropTypes.node
};

export default CreateResource;
