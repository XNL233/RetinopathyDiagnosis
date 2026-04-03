# 视网膜病变AI诊断平台后端服务

## 环境要求

- Node.js >= 14.0.0
- MySQL >= 5.7

## 完整启动流程

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置数据库

在 `server` 目录下创建或编辑 `.env` 文件，设置数据库连接信息：

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456  # 替换为你的MySQL密码
DB_NAME=retinopathy_diagnosis
JWT_SECRET=your_jwt_secret_key_here
```

### 3. 启动MySQL服务

以管理员身份运行 Windows PowerShell:

```bash
# 启动MySQL服务
net start MySQL

# 检查MySQL服务状态
sc query MySQL
```

### 4. 创建数据库（可选）

可以手动创建数据库，也可以让应用自动创建：

```bash
# 手动创建数据库
mysql -u root -p123456 -e "CREATE DATABASE IF NOT EXISTS retinopathy_diagnosis;"
```

### 5. 启动后端服务

```bash
cd server
npm start
```

服务将运行在 `http://localhost:3001`

首次启动时，系统会自动：
- 创建数据库（如果不存在）
- 创建用户表结构
- 建立数据库连接

### 6. 验证服务是否正常运行

```bash
# 测试健康检查接口
curl http://localhost:3001/api/health
# 或使用PowerShell
Invoke-WebRequest -Uri "http://localhost:3001/api/health"
```

## API接口

### 认证接口

- `POST /api/auth/login` - 用户登录
  - 请求体：`{"username": "admin", "password": "123456"}`
  - 返回：JWT令牌和用户信息

- `POST /api/auth/register` - 用户注册
  - 请求体：`{"username": "admin", "password": "123456", "email": "admin@example.com", "phone": "13800138000", "identityCard": "110101199001011234"}`
  - 返回：用户ID

- `GET /api/auth/profile` - 获取用户信息（需要认证）
  - 请求头：`Authorization: Bearer {token}`
  - 返回：用户详细信息

### 健康检查

- `GET /api/health` - 服务健康检查
  - 返回：`{"code": 200, "message": "服务运行正常"}`

## 数据库表结构

### users表
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  identity_card VARCHAR(18),
  role ENUM('doctor', 'admin') DEFAULT 'doctor',
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 测试账号

系统启动时会自动创建数据库和表结构。你可以通过注册接口创建新用户：

```bash
# 使用PowerShell注册用户
Invoke-WebRequest -Uri "http://localhost:3001/api/auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"username":"admin","password":"123456","email":"admin@example.com","phone":"13800138000","identityCard":"110101199001011234"}'

# 使用PowerShell登录
Invoke-WebRequest -Uri "http://localhost:3001/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"username":"admin","password":"123456"}'
```

## 注意事项

1. 确保MySQL服务已启动
2. 确保数据库用户有创建数据库和表的权限
3. 首次运行时会自动创建数据库和表结构
4. JWT密钥必须设置，否则登录功能会失败
5. 密码会自动进行bcrypt加密存储