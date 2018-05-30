import { observable, action } from 'mobx';
import Store from './Store';

export default class CategoryHandleStore extends Store {
  @observable name = '';
  @observable locale = '';
  @observable categoryId = '';
  @observable showCategoryModal = false;
  @observable showDeleteModal = false;

  @action
  createCategoryShow = () => {
    this.showCategoryModal = true;
  };

  @action
  createCategoryClose = () => {
    this.showCategoryModal = false;
  };

  @action
  categorySubmit = async categoryStore => {
    const params = {
      name: this.name,
      locale: this.locale
    };
    await categoryStore.fetchAddCategory(params);
    this.showCategoryModal = false;
    await categoryStore.fetchCategories();
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
    await categoryStore.fetchDeleteCategory([this.categoryId]);
    this.deleteCategoryClose();
    await categoryStore.fetchCategories();
  };
}
