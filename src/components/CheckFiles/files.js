export default {
  vmbased: [
    {
      name: 'package.json',
      description:
        'Package.json文件，用于描述应用或版本的基本信息，包括名称版本号等'
    },
    { name: 'config.json', description: '应用的默认值配置文件' },
    { name: 'LICENSE', description: '文本格式的协议' },
    {
      name: 'locale/en.json',
      description: '应用配置的国际化英文翻译',
      isOptional: true
    },
    {
      name: 'locale/zh-en.json',
      description: '应用配置的国际化中文翻译',
      isOptional: true
    }
  ],
  helm: [
    {
      name: 'Chart.yaml',
      description: 'Yaml文件，用于描述 Chart 的基本信息，包括名称版本等'
    },
    { name: 'LICENSE', description: '文本格式的协议', isOptional: true },
    {
      name: 'README.md',
      description: '应用介绍、使用说明',
      isOptional: true
    },
    {
      name: 'requirements.yaml',
      description: '用于存放当前 Chart 依赖的其它 Chart 的说明文件',
      isOptional: true
    },
    { name: 'values.yaml', description: 'Chart 的默认值配置文件' },
    {
      name: 'charts/',
      description: '该目录中放置当前 Chart 依赖的其它 Chart',
      isOptional: true,
      check: 'none'
    },
    {
      name: 'templates/',
      description:
        '部署文件模版目录，模版填入 values.yaml 中相应值，生成最终的 kubernetes 配置文件',
      isOptional: true
    },
    { name: 'templates/NOTES.txt', description: '使用指南', isOptional: true }
  ],
  saas: [],
  api: [],
  native: [],
  serveless: []
};
