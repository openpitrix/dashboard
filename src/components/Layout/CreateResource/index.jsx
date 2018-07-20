import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Grid, Section, Card } from 'components/Layout';

import styles from './index.scss';

const CreateResource = ({ className, children, title, aside, asideTitle, ...rest }) => (
  <div className={classnames(styles.wrapper, className)} {...rest}>
    <Grid>
      <Section size={8}>
        <Card>
          <div className={styles.title}>{title}</div>
          {children}
        </Card>
      </Section>

      {aside && (
        <Section>
          <div className={styles.title}>{asideTitle}</div>
          <div className={styles.content}>{aside}</div>
        </Section>
      )}
    </Grid>
  </div>
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
