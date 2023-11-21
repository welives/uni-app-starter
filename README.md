# uni-app-starter

一个开箱即用的基于 `uni-app` + `Vue3` + `Pinia` + `Vant-Weapp` + `TailwindCSS` + `TypeScript` 的项目模板

这个工程的搭建笔记可以[在这里查看](https://welives.github.io/blog/front-end/engineering/uni-app.html)

## 使用

```sh
pnpm install
# Windows
cmd
mklink /j "./src/wxcomponents/vant-weapp" "./node_modules/@vant/weapp/dist"
# Linux
ln -s ./src/wxcomponents/vant-weapp ./node_modules/@vant/weapp/dist
```

### 开发模式

```sh
pnpm dev:h5
pnpm dev:mp-weixin
```

## 相关文档

- [Vue](https://cn.vuejs.org/guide/introduction.html)
- [uni-app](https://zh.uniapp.dcloud.io/quickstart-cli.html)
- [Vant-Weapp](https://vant-contrib.gitee.io/vant-weapp/#/home)
- [Pinia](https://pinia.vuejs.org/zh/)
- [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/)
- [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import#readme)
- [TailwindCSS](https://tailwind.nodejs.cn/)
- [weapp-tailwindcss](https://weapp-tw.icebreaker.top/docs/intro)
- [TypeScript](https://www.tslang.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)
