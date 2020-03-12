// 项目发布阶段需要用到的 babel 插件
const prodPlugins=[]
//发布模式
if(process.env.NODE_ENV==='production'){
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
      //发布模式下的插件数组
      ...prodPlugins,
    //配置路由懒加载插件
      "@babel/plugin-syntax-dynamic-import"
  ]
}
