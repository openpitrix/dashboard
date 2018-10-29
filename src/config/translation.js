const tsObj = {
  zh: {
    ' days ago': ' 天前',
    ' hours ago': ' 小时前',

    'Deploy app successfully.': '部署应用成功',
    'Please input or select: ': '请输入或选择：',
    'Delete app successfully.': '删除应用成功。',
    'Please select a category': '请选择一个分类',
    'Modify category successfully': '修改分类成功',
    'Please input version name': '请输入版本名称',
    'Please upload package': '请上传压缩包',
    'Submit this version successfully.': '提交版本成功',
    'Cancel this version successfully.': '取消版本成功',
    'Pass this version successfully.': '通过版本成功',
    'Reject this version successfully.': '拒绝版本成功',
    'Release this version successfully.': '发布版本成功',
    'Suspend this version successfully.': '下架版本成功',
    'Recover this version successfully.': '恢复版本成功',
    'Delete this version successfully.': '删除版本成功',

    'Please input category name!': '请输入分类的名称！',
    'Create category successfully.': '创建分类成功。',
    'Modify category successfully.': '修改分类成功。',
    'Delete category successfully.': '删除分类成功。',

    'Delete cluster successfully.': '删除集群成功。',
    'Start cluster successfully.': '启动集群成功。',
    'Stop cluster successfully.': '停用集群成功。',
    'Cease cluster successfully.': '暂停集群成功。',
    'Rollback cluster successfully.': '回滚集群成功。',
    'Update cluster environment successfully.': '更新集群环境成功。',
    'Upgrade cluster successfully.': '升级集群成功。',
    'Please input version name': '请输入版本名称',
    'Please upload package': '请上传压缩包',
    'Package url is empty or invalid!': '压缩包的URL为空或是无效的',
    'Create App Version successful.': '创建应用版本成功。',

    'Please input Name!': '请输入名称！',
    'Please input public key!': '请输入公钥！',
    'Create SSH Key successful!': '创建SSH密钥成功！',
    'Detach SSH Key successfully.': '解除SSH密钥的绑定成功。',
    'Delete SSH Key successfully.': '删除SSH密钥成功。',

    "Kubernetes can't be selected with others": '不能与其它云服务商一起选择Kubernetes',
    'Validate successfully': '验证成功',
    'Validate fail': '验证失败',
    'Please select at least one Runtime Provider': '请至少选择一个云环境服务商',
    'Runtime Selector missing key': '环境选择器缺失键',
    'Runtime Selector missing value': '环境选择器缺失值',
    'Invalid s3 url, should be like s3://s3.pek3a.qingstor.com/op-repo':
      '无效的s3网址，应该是这样: s3://s3.pek3a.qingstor.com/op-repo',
    'Verify that the information requested is incomplete!': '验证要求输入的信息不完整！',
    'Access key verification successfully': '访问密钥验证成功',
    'Access key verification fail': '访问密钥验证失败',
    'Create repo successfully': '创建仓库成功',
    'Modify repo successfully': '修改仓库成功',
    'Delete repo successfully.': '删除仓库成功',
    'Started repo indexer:': '已启动的仓库索引:',
    'Start repo indexer failed:': '启动仓库索引失败:',

    'Please input Name!': '请输入名称！',
    'Please input URL!': '请输入URL！',
    'Please input Access Key ID!': '请输入访问密钥ID！',
    'Please input Secret Access Key!': '请输入访问密钥私钥！',
    'Please select Zone!': '请选择区域！',
    'Please input kubeconfig!': '请输入kubeconfig！',
    'Labels has repeat key': '标签有重复的键',
    'Labels missing key': '有标签对缺失键',
    'Labels missing value': '有标签对缺失值',
    'Create runtime successfully.': '创建环境成。',
    'Modify runtime successfully.': '修改环境成功。',
    'Delete runtime successfully.': '删除环境成功。',

    'Modify user successful.': '修改用户信息成功。',
    'New password is different entered twice.': '新密码两次的输入不一样。',
    'Change password successful.': '修改密码成功。'
  },
  en: {}
};

export default key => {
  const locale = localStorage.getItem('i18nextLng') || 'zh';
  return tsObj[locale][key] || key;
};
