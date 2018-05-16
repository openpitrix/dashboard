import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';

import ManageTabs from 'components/ManageTabs';
import Rectangle from 'components/Rectangle';
import styles from './index.scss';
import preload from 'hoc/preload';

@inject(({ rootStore }) => ({
  categoryStore: rootStore.categoryStore
}))
@observer
@preload('fetchCategories')
export default class Categories extends Component {
  render() {
    const { categoryStore } = this.props;
    const categoryList = toJS(categoryStore.categories) || [];

    return (
      <div className={styles.roles}>
        <ManageTabs />
        <div className={styles.container}>
          <div className={styles.pageTitle}>Categories</div>
          <div className={styles.categories}>
            <div className={styles.line}>
              <div className={styles.word}>Default ({categoryList.length})</div>
            </div>
          </div>
          <div>
            {categoryList.map(data => (
              <Rectangle
                key={data.category_id}
                id={data.category_id}
                title={data.name}
                idNo={data.idNo}
                description={data.description}
                images={data.images}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
