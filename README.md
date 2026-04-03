# 🩺 视网膜病变 AI 诊断平台

<p align="center">
  <b>基于 Vue 3 的视网膜病变智能辅助诊断前端平台</b><br/>
  为医生提供医学数据上传、图像增强、AI 诊断、结果标注与诊断管理等能力
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.x-42b883?style=for-the-badge&logo=vue.js" />
  <img src="https://img.shields.io/badge/Vite-Build-646cff?style=for-the-badge&logo=vite" />
  <img src="https://img.shields.io/badge/Element%20Plus-UI-409eff?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-Supported-3178c6?style=for-the-badge&logo=typescript" />
</p>



---

## 📖 项目简介

**视网膜病变 AI 诊断平台** 是一个基于 **Vue 3** 构建的前端应用，旨在为医生提供高效、智能、便捷的视网膜病变辅助诊断工具。

平台支持医学数据上传、图像增强、AI 自动诊断、医生标注与意见补充等功能，可帮助医生提升诊断效率与准确性，适用于医学影像辅助分析与智能诊断场景。

---

## ✨ 核心亮点

- 🧠 **AI 辅助诊断**：集成视网膜病变智能诊断能力
- 🖼️ **医学图像增强**：支持原图与增强图双视图对比
- 🩺 **医生协同参与**：支持医生查看 AI 结果并补充专业意见
- 🔐 **数据安全保障**：支持 AES-256、RSA、混合加密等多种加密方式
- 🧩 **模块化设计**：结构清晰，便于后续维护与扩展
- 📱 **响应式界面**：适配不同尺寸设备，提升使用体验

---

## 🛠️ 技术栈

### 前端技术栈

| 类别      | 技术                     |
| --------- | ------------------------ |
| 前端框架  | Vue 3（Composition API） |
| UI 组件库 | Element Plus             |
| 构建工具  | Vite                     |
| 样式方案  | SCSS                     |
| 路由管理  | Vue Router               |
| 类型支持  | TypeScript               |

### 后端技术栈

| 类别      | 技术                     |
| --------- | ------------------------ |
| 后端框架  | Express                  |
| 数据库    | MySQL                    |
| 认证方案  | JWT（JSON Web Token）    |
| 密码加密  | bcrypt                   |
| 跨域处理  | CORS                     |

### 算法模型

| 类别      | 技术                     |
| --------- | ------------------------ |
| 深度学习框架 | PyTorch                  |

---

## 📂 项目结构

```bash
RetinopathyDiagnosis-pc/
 ├── algorithm/              # 算法文件目录
 │   ├── input/              # 图像输入目录
 │   └── output/             # 模型输出目录
 │       └── m1/             # 模型 1 输出目录
 │       └── m2/             # 模型 2 输出目录
 │       └── m3/             # 模型 3 输出目录
 ├── server/                 # 后端服务目录
 │   ├── config/             # 配置文件目录
 │   │   └── db.js           # 数据库配置
 │   ├── controllers/        # 控制器目录
 │   │   └── AuthController.js # 认证控制器
 │   ├── middleware/         # 中间件目录
 │   │   └── auth.js         # 认证中间件
 │   ├── models/             # 数据模型目录
 │   │   └── User.js         # 用户模型
 │   ├── routes/             # 路由目录
 │   │   └── auth.js         # 认证路由
 │   ├── utils/              # 工具函数目录
 │   │   ├── init_db.js      # 数据库初始化
 │   │   └── jwt.js          # JWT 工具
 │   ├── .env                # 环境变量配置
 │   ├── README.md           # 后端说明文档
 │   ├── app.js              # 后端应用入口
 │   └── package.json        # 后端依赖配置
 ├── src/                    # 前端源代码目录
 │   ├── api/                # API 接口目录
 │   │   ├── auth.js         # 认证相关接口
 │   │   └── upload.js       # 上传相关接口
 │   ├── assets/             # 静态资源目录
 │   │   ├── images/         # 图片资源目录
 │   │   └── styles/         # 样式文件目录
 │   │       └── global.scss # 全局样式文件
 │   ├── constants/          # 常量定义目录
 │   │   └── index.ts        # 常量定义文件
 │   ├── router/             # 路由配置目录
 │   │   └── index.js        # 路由主文件
 │   ├── types/              # TypeScript 类型定义目录
 │   │   └── index.ts        # 类型定义文件
 │   ├── utils/              # 工具函数目录
 │   │   ├── index.ts        # 工具函数入口文件
 │   │   └── request.ts      # 网络请求工具
 │   ├── views/              # 页面组件目录
 │   │   ├── auth/           # 认证相关页面
 │   │   │   └── index.vue   # 登录/注册页面
 │   │   ├── dashboard/      # 仪表板页面
 │   │   │   └── index.vue   # 仪表板主页面
 │   │   ├── diagnosis/      # 诊断相关页面
 │   │   │   └── index.vue   # 诊断主页面
 │   │   └── upload/         # 上传页面
 │   │       └── index.vue   # 上传主页面
 │   ├── App.vue             # 根组件
 │   └── main.js             # 应用入口文件
 ├── node_modules/           # 项目依赖目录
 ├── index.html              # HTML 入口文件
 ├── package.json            # 项目配置文件
 ├── package-lock.json       # NPM 依赖锁定文件
 ├── README.md               # 项目说明文档
 └── vite.config.js          # Vite 构建配置文件
```

---

## 🚀 完整启动流程

### 环境要求

#### 系统要求
- **操作系统**：Windows 10/11、Linux、macOS
- **浏览器**：Chrome 90+、Firefox 88+、Edge 90+

#### 开发环境
- **Node.js**：>= 14.0.0
- **npm**：>= 6.0.0
- **MySQL**：>= 5.7
- **Git**：>= 2.0.0

### 1. 启动后端服务

#### 1.1 安装后端依赖

```bash
cd server
npm install
```

#### 1.2 配置数据库

在 `server` 目录下创建 `.env` 文件，设置数据库连接信息：

```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456  # 替换为你的MySQL密码
DB_NAME=user_data
JWT_SECRET=your_jwt_secret_key_here
```

#### 1.3 启动MySQL服务

以管理员身份运行 Windows PowerShell:

```bash
# 启动MySQL服务
net start MySQL

# 检查MySQL服务状态
sc query MySQL
```

#### 1.4 启动后端服务

```bash
cd server
npm start
```

后端服务将运行在 `http://localhost:3001`

首次启动时，系统会自动：
- 创建 `user_data` 数据库（如果不存在）
- 创建用户表结构，包含完整的字段定义
- 建立数据库连接

### 2. 启动前端服务

#### 2.1 安装前端依赖

```bash
npm install
```

#### 2.2 启动前端开发服务器

```bash
npm run dev
```

前端服务将运行在 `http://localhost:3000`（默认端口）

### 3. 访问应用

在浏览器中打开：`http://localhost:3000`

### 4. 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录。

### 5. 预览生产构建

```bash
npm run preview
```

---

## 🔍 核心功能

### 1. 认证模块

- 用户登录 / 注册
- 表单验证
- 医生身份认证

### 2. 上传模块

- 支持多类型文件上传（图像、视频、文本）
- 文件合法性校验
- 上传状态显示
- 数据加密传输
  - AES-256
  - RSA
  - 混合加密

### 3. 诊断模块

- 原始图像与增强图像双视图对比
- 图像放大、缩小、拖动等操作
- 标注功能
  - 圆形标注
  - 矩形标注
  - 文本标注
- 模型配置
  - 图像增强模型
  - 糖网诊断模型
  - 硬件选择
- AI 自动诊断
- 医生诊断意见补充

### 4. 仪表板模块

- 诊断统计信息展示
- 最近诊断记录
- 模型性能可视化展示

---

## 📡 API 接口

### 认证相关

| 方法 | 路径 | 描述 | 请求参数 | 成功响应 |
|------|------|------|----------|----------|
| `POST` | `/api/auth/login` | 用户登录 | `{"username": "string", "password": "string"}` | `{"code": 200, "message": "登录成功", "data": {"token": "string", "user": {...}}}` |
| `POST` | `/api/auth/register` | 用户注册 | `{"username": "string", "password": "string", "email": "string", "phone": "string", "identityCard": "string"}` | `{"code": 201, "message": "注册成功", "data": {"userId": number}}` |
| `GET` | `/api/auth/profile` | 获取用户信息 | 无（需要在请求头添加 `Authorization: Bearer {token}`） | `{"code": 200, "message": "获取用户信息成功", "data": {...}}` |

### 上传相关

| 方法 | 路径 | 描述 | 请求参数 | 成功响应 |
|------|------|------|----------|----------|
| `POST` | `/api/upload/image` | 上传图像文件 | `multipart/form-data`（文件字段名：`file`） | `{"code": 200, "message": "上传成功", "data": {"fileId": string, "url": string}}` |
| `POST` | `/api/upload/video` | 上传视频文件 | `multipart/form-data`（文件字段名：`file`） | `{"code": 200, "message": "上传成功", "data": {"fileId": string, "url": string}}` |
| `POST` | `/api/upload/text` | 上传文本文件 | `multipart/form-data`（文件字段名：`file`） | `{"code": 200, "message": "上传成功", "data": {"fileId": string, "url": string}}` |

### 通用响应格式

```json
{
  "code": 200,          // 状态码（200-成功，400-请求错误，401-未授权，500-服务器错误）
  "message": "成功",     // 提示信息
  "data": {}            // 返回数据
}
```

### 错误码说明

| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | 成功 | 请求成功 |
| 201 | 创建成功 | 资源创建成功（如用户注册） |
| 400 | 请求错误 | 请求参数错误或业务逻辑错误 |
| 401 | 未授权 | 需要登录或token无效 |
| 403 | 禁止访问 | 权限不足 |
| 404 | 资源不存在 | 请求的资源不存在 |
| 500 | 服务器错误 | 服务器内部错误 |

---

## 🧭 开发规范

为保证项目可维护性与协作效率，建议遵循以下规范：

- **文件命名**：`kebab-case`
- **组件命名**：`PascalCase`
- **函数 / 变量命名**：`camelCase`
- **常量命名**：`UPPER_SNAKE_CASE`

---

## 📬 联系方式

- **开发团队**：南京邮电大学团队
- **项目地址**：[XNL233/RetinopathyDiagnosis-pc](https://github.com/XNL233/RetinopathyDiagnosis-pc)
