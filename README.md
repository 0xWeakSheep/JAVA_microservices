# Movies

## 微服务架构

项目采用 Spring Cloud 微服务架构，包含以下组件：

- `eureka-server`：Eureka 注册中心，端口 `8761`
- `config-server`：Spring Cloud Config 配置中心，端口 `8888`
- `movies-gateway`：Spring Cloud Gateway 反向代理，端口 `3000`
- `movies-backend`：Spring Boot 后端（movies-service），端口 `3001`
- `movies-frontend`：Next.js 前端，端口 `3002`

### 启动顺序
1. eureka-server（注册中心）
2. config-server（配置中心）
3. movies-backend（业务服务，从配置中心拉取配置）
4. movies-gateway（网关）
5. movies-frontend（前端）

## PM2 运维管理

项目按独立进程交给 `pm2` 管理：

根目录已经提供 `ecosystem.config.cjs`。

网关当前的本地转发规则：

- `/api/**` -> `http://localhost:3001`
- `/**` -> `http://localhost:3002`

## 首次部署

先安装依赖并构建：

```bash
# 后端
mvn clean package -DskipTests

# 网关
cd gateway
mvn clean package -DskipTests
cd ..

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
pm2 start ecosystem.config.cjs --only movies-gateway
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
pm2 logs movies-gateway
```

单独重启：

```bash
pm2 restart movies-gateway
pm2 restart movies-backend
pm2 restart movies-frontend
```

单独停止：

```bash
pm2 stop movies-gateway
pm2 stop movies-backend
pm2 stop movies-frontend
```

删除进程：

```bash
pm2 delete movies-gateway
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

# 2. 重新构建网关
cd gateway
mvn clean package -DskipTests
cd ..

# 3. 重新构建前端
cd frontend
npm run build
cd ..

# 4. 分别重启
pm2 restart movies-gateway
pm2 restart movies-backend
pm2 restart movies-frontend
```

## 网关入口

如果你希望统一从一个入口访问服务，可以直接访问：

```text
http://localhost:3000
```

## 环境变量

后端默认读取根目录 `.env`，并使用：

```properties
MONGODB_URI=mongodb://localhost:27017/polymarket_db
```

前端如需额外环境变量，可放在 `frontend/.env` 或 `frontend/.env.production`。
