import { observable, action } from 'mobx';
import Store from './Store';
import { assign } from 'lodash';

export default class CategoryHandleStore extends Store {
  @observable name = '';
  @observable locale = '';
  @observable categoryId = '';
  @observable categoryDetail = {};
  @observable showCategoryModal = false;
  @observable showDeleteModal = false;

  @action
  createCategoryShow = () => {
    this.categoryDetail = {};
    this.showCategoryModal = true;
  };

  @action
  createCategoryClose = () => {
    this.showCategoryModal = false;
  };

  @action
  modifyCategoryShow = category => {
    this.categoryDetail = category;
    this.showCategoryModal = true;
  };

  @action
  categorySubmit = async (categoryStore, categoryId, type) => {
    const params = {
      name: this.name || this.categoryDetail.name,
      locale: this.locale || this.categoryDetail.locale
    };
    if (categoryId) {
      await categoryStore.modifyCategory(assign(params, { category_id: categoryId }));
    } else {
      await categoryStore.createCategory(params);
    }
    this.showCategoryModal = false;
    if (type === 'detail') {
      await categoryStore.fetchCategoryDetail(categoryId);
    } else {
      await categoryStore.fetchCategories();
    }
  };

  @action
  changeName = e => {
    this.name = e.target.value;
  };

  @action
  changeLocale = e => {
    this.locale = e.target.value;
  };

  @action
  deleteCategoryShow = id => {
    this.categoryId = id;
    this.showDeleteModal = true;
  };

  @action
  deleteCategoryClose = () => {
    this.showDeleteModal = false;
  };

  @action
  deleteCategory = async categoryStore => {
    await categoryStore.deleteCategory([this.categoryId]);
    this.deleteCategoryClose();
    await categoryStore.fetchCategories();
  };
}
