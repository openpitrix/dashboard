import React, { Component } from 'react';
/* import PropTypes from 'prop-types';
 * import classnames from 'classnames'; */
import Layout from 'components/Layout';
import Collapse from 'components/Collapse';

import styles from './index.scss';

export default class TeamRole extends Component {
  renderTitle({ title, describtion }) {
    return (
      <div>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.describtion}>{describtion}</div>
      </div>
    );
  }

  render() {
    const roles = [
      {
        title: '超级管理员',
        describtion: '拥有所有功能的最高权限，不得编辑和删除。'
      },
      {
        title: '开发人员',
        describtion: '负责开发、测试、运维应用。'
      }
    ];
    return (
      <Layout
        className={styles.container}
        isCenterPage
        centerWidth={772}
        pageTitle="Role"
      >
        {roles.map(role => (
          <Collapse
            key={role.title}
            className={styles.roleContainer}
            header={this.renderTitle(role)}
            iconPosition="right"
          >
            test
          </Collapse>
        ))}
      </Layout>
    );
  }
}
