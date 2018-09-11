import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.scss';

export default class OrgTree extends PureComponent {
  static propTypes = {
    treeFlag: PropTypes.bool,
    organizations: PropTypes.array
  };

  render() {
    const { organizations, clickCompany, clickDep } = this.props;

    return (
      <ul className={styles.orgTree}>
        {organizations &&
          organizations.map((data, index) => (
            <li key={data.org_id}>
              <div
                className={styles.name}
                onClick={() => {
                  clickCompany(index);
                }}
              >
                <i className={`fa fa-caret-${data.depShow ? 'down' : 'right'}`} />
                {data.company}
              </div>
              <ul className={classnames({ [styles.hide]: !data.depShow })}>
                {data.department &&
                  data.department.map((depData, depIndex) => (
                    <li
                      key={depIndex}
                      onClick={() => {
                        clickDep(index, depIndex);
                      }}
                    >
                      <div className={styles.name}>
                        <i className={`fa fa-caret-${depData.staffShow ? 'down' : 'right'}`} />
                        {depData.name}
                      </div>
                      <ul className={classnames({ [styles.hide]: !depData.staffShow })}>
                        {depData.staff &&
                          depData.staff.map(staffData => (
                            <li key={staffData}>
                              <div className={styles.lastName}>{staffData}</div>
                            </li>
                          ))}
                      </ul>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
      </ul>
    );
  }
}
