import React, { Component } from 'react';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { getParseDate } from 'utils';

import ManageTabs from 'components/ManageTabs';
import Rectangle from 'components/Rectangle';
import styles from './index.scss';

@inject(({ rootStore }) => ({
  categorieStore: rootStore.categorieStore
}))
@observer
export default class Categories extends Component {
  static async onEnter({ categorieStore }) {
    await categorieStore.fetchCategories();
  }

  render() {
    const { categorieStore } = this.props;
    const categorieList = toJS(categorieStore.categories.items) || [];

    return (
      <div className={styles.roles}>
        <ManageTabs />
        <div className={styles.container}>
          <div className={styles.pageTitle}>Categories</div>
          <div className={styles.categories}>
            <div className={styles.line}>
              <div className={styles.word}>Default (3)</div>
            </div>
          </div>
          <div>
            {categorieList.map(data => (
              <Rectangle
                key={data.id}
                title={data.name}
                idNo={data.idNo}
                description={data.description}
                imgArray={data.imgArray}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
