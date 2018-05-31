import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';

import ManageTabs from 'components/ManageTabs';
import Rectangle from 'components/Rectangle';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  store: rootStore.categoryStore
}))
@observer
export default class Categories extends Component {
  static async onEnter({ categoryStore }) {
    await categoryStore.fetchCategories();
  }

  render() {
    const { categories } = this.props.store;

    return (
      <div className={styles.roles}>
        <ManageTabs />
        <div className={styles.container}>
          <div className={styles.pageTitle}>Categories</div>
          <div className={styles.categories}>
            <div className={styles.line}>
              <div className={styles.word}>Default ({categories.length})</div>
            </div>
          </div>
          <div>
            {categories.map(data => (
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
