const tsObj = {
  zh: {
    ' days ago': ' 天前',
    ' hours ago': ' 小时前'
  },
  en: {

  }
};

export default (key) => {
  const locale = localStorage.getItem('i18nextLng') || 'zh';
  return tsObj[locale][key] || key;
}
