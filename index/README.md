# demo

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### index.html空白解决方案

##### 在项目根目录下新增 vue.config.js

```
module.exports = {
    publicPath: './', //配置本地引用目录文件,如不配置，默认为`/`
}
```

