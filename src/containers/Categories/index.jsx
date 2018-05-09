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
  categorieStore: rootStore.categorieStore
}))
@observer
@preload('fetchCategories')
export default class Categories extends Component {
  render() {
    const { categorieStore } = this.props;
    const categorieList = toJS(categorieStore.categories) || [];

    return (
      <div className={styles.roles}>
        <ManageTabs />
        <div className={styles.container}>
          <div className={styles.pageTitle}>Categories</div>
          <div className={styles.categories}>
            <div className={styles.line}>
              <div className={styles.word}>Default ({categorieList.length})</div>
            </div>
          </div>
          <div>
            {categorieList.map(data => (
              <Rectangle
                key={data.id}
                id={data.id}
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
