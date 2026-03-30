# orange-admin

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm run dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm run lint
```

## 文件命名规范

组件文件components:

    双驼峰大写： AbcDef

页面文件名：

    全小写： abcd


## Git 提交规范

`commit 消息组成：类型 + 冒号 + 空格 + 动宾短语`

如：feat: 完成 xxx 页面编写

   fix: 修复了页面无法跳转的 bug

### 类型

- `feat` 增加新功能
- `fix` 修复问题/BUG
- `style` 代码风格相关无影响运行结果的
- `perf` 优化/性能提升
- `refactor` 重构
- `revert` 撤销修改
- `test` 测试相关
- `docs` 文档/注释
- `chore` 依赖更新/脚手架配置修改等
- `workflow` 工作流改进
- `ci` 持续集成
- `types` 类型定义文件更改
- `wip` 开发中

## 其他

1. 使用log调试后，必须及时注释或删除！！！
