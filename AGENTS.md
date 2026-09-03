# 前端项目约束（Codex / AI 编码助手必读）

以下是对当前仓库前端开发工作的**硬性约束**。违反约束即越界，必须先停下说明，不得静默绕过、降级或改写命令规避。

## 技术栈（固定，不替换）
- 构建工具：**Vite**
- 框架：**Vue 3**（Composition API）
- UI 组件库：**Element Plus**
- 包管理器：**Yarn**
- Node 版本管理：**nvm**
- Node 版本：**22.23**（本机 nvm 中对应 `v22.23.2`）

## Node 版本切换（执行任何前端操作前必做）
在安装依赖、构建、启动开发服务器、运行脚本、lint、测试等**任何**前端操作之前：
1. 必须先执行 `nvm use 22.23` 切换到指定 Node 版本，再继续后续命令。
2. 切换后执行 `node -v` 确认输出为 `v22.23.x`，确认通过后才可继续。
3. 禁止使用其他 Node 版本（如 v18 / v20）执行前端命令；本机默认版本虽为 v22.23.2，但**不得依赖默认值，仍需显式切换**。
4. Yarn 使用当前 Node 版本对应的 Yarn；若 `yarn` 命令不可用，先通过 `corepack enable` 启用，再使用 `yarn`。

## Git 约束（硬性）
- **仅允许只读操作**：`git status`、`git diff`、`git log`、`git show`、`git branch -a` 等查看/查询类命令。
- **禁止一切写操作**，包括但不限于：`git add`、`git commit`、`git push`、`git pull`、`git fetch`（修改本地仓库状态）、`git merge`、`git rebase`、`git reset`、`git checkout`（切换分支）、`git stash`、`git tag`、`git clean`、`git restore`。
- 提交、推送、分支管理等变更仓库状态的操作**一律由用户本人完成**，助手不得代为执行。

## 通用要求
- 改动范围仅限被点名的内容，未要求改动的文件与代码保持原样。
- 每个数字、配置与依赖版本需有真实来源或可复现依据，不得凭空填写。
