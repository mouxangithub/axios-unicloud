<h1> axios-unicloud </h1>
一款云函数请求的拦截器，基于axios的adapter进行封装

## 该封装形式是基于单一的云函数进行封装的，如果是多个云函数请自行更改

# 目录结构
```
├── lib                     插件主要目录
|   └── axios-unicloud.js   封装的axios的unicloud
└── README.md               说明文档 
```

# 使用安装方法

使用 npm/yarn 安装

```
$ npm install axios-unicloud
$ yarn add axios-unicloud

使用方法：
import axios from 'axios-unicloud'
axios.get(url,{params}).then()
```

使用[uniapp插件市场](https://ext.dcloud.net.cn/plugin?id=2637)导入插件

```
因插件是基于axios进行封装的需另外安装axios
npm install axios
yarn add axios
使用方法：
import axios from '../js_sdk/mouxan-axios-unicloud'
axios.get(url,{params}).then()
```


云函数模式可通过axios.defaults.module = 'single'进行配置(single为单一云函数，many为多云函数)
多云函数不需要配baseCloud基础云函数
当配置了baseCloud没配置module时，自动匹配为单一云函数，若二者都没配默认为uni.request请求
uni.request我暂时没进行封装，如需使用请自行扩展


[MIT](LICENSE)
