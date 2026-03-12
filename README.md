# Movies

## PM2 运维管理

项目现在按前后端两个独立进程交给 `pm2` 管理：

- `movies-backend`：Spring Boot 后端，端口 `3001`
- `movies-frontend`：Next.js 前端，端口 `3002`

根目录已经提供 `ecosystem.config.cjs`。

## 首次部署

先安装依赖并构建：

```bash
# 后端
mvn clean package -DskipTests

# 前端
cd frontend
npm install
npm run build
cd ..
```

确保机器上已安装：

- `Java 17`
- `Node.js`
- `pm2`

安装 `pm2`：

```bash
npm install -g pm2
```

## 启动方式

分别启动后端和前端：

```bash
pm2 start ecosystem.config.cjs --only movies-backend
pm2 start ecosystem.config.cjs --only movies-frontend
```

也可以一起启动：

```bash
pm2 start ecosystem.config.cjs
```

## 常用运维命令

查看状态：

```bash
pm2 status
```

查看日志：

```bash
pm2 logs movies-backend
pm2 logs movies-frontend
```

单独重启：

```bash
pm2 restart movies-backend
pm2 restart movies-frontend
```

单独停止：

```bash
pm2 stop movies-backend
pm2 stop movies-frontend
```

删除进程：

```bash
pm2 delete movies-backend
pm2 delete movies-frontend
```

保存当前进程列表：

```bash
pm2 save
```

配置开机自启：

```bash
pm2 startup
```

## 更新发布

代码更新后，建议按下面顺序处理：

```bash
# 1. 重新构建后端
mvn clean package -DskipTests

# 2. 重新构建前端
cd frontend
npm run build
cd ..

# 3. 分别重启
pm2 restart movies-backend
pm2 restart movies-frontend
```

## 环境变量

后端默认读取根目录 `.env`，并使用：

```properties
MONGODB_URI=mongodb://localhost:27017/polymarket_db
```

前端如需额外环境变量，可放在 `frontend/.env` 或 `frontend/.env.production`。
