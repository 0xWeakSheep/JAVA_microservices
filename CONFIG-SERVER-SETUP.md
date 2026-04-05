# Spring Cloud Config Server 配置中心搭建指南

## 作业要求实现内容

本配置中心实现了以下实验要求：

1. ✅ **搭建配置中心服务端（Config Server）** - 端口 8888
2. ✅ **改造业务服务为配置客户端（Config Client）** - movies-service
3. ✅ **实现配置的动态刷新（无需重启服务）** - 使用 /actuator/refresh 端点
4. ✅ **验证多环境配置切换** - dev/test/prod 三种环境

---

## 项目结构

```
Movies/
├── eureka-server/          # Eureka 注册中心 (端口: 8761)
├── config-server/          # Config Server 配置中心 (端口: 8888)
├── gateway/                # API 网关 (端口: 3000)
├── src/                    # 主业务服务 movies-service (端口: 3001)
│   └── main/java/edu/cuit/yingpingsxitong/
│       └── Controller/
│           └── ConfigDemoController.java  # 配置演示控制器
└── frontend/               # 前端应用 (端口: 3002)
```

---

## 启动顺序

### 1. 启动 Eureka Server（注册中心）

```bash
cd eureka-server
mvn spring-boot:run
```

访问: http://localhost:8761

### 2. 启动 Config Server（配置中心）

```bash
cd config-server
mvn spring-boot:run
```

访问: http://localhost:8888

**验证 Config Server 是否正常工作：**

访问以下地址查看配置：
- http://localhost:8888/movies-service/dev
- http://localhost:8888/movies-service/test
- http://localhost:8888/movies-service/prod

### 3. 启动主业务服务（配置客户端）

```bash
cd /Users/caoxiangrui/Desktop/学习/大三下/weifuwu/Movies
mvn spring-boot:run
```

服务会自动从 Config Server 拉取配置启动。

### 4. 启动 Gateway（服务消费者）

```bash
cd gateway
mvn spring-boot:run
```

---

## 配置中心功能验证

### 1. 验证 Config Server 提供配置接口

浏览器访问：
- `http://localhost:8888/movies-service/dev` - 查看开发环境配置
- `http://localhost:8888/movies-service/test` - 查看测试环境配置
- `http://localhost:8888/movies-service/prod` - 查看生产环境配置

返回格式为 JSON，包含所有配置属性。

### 2. 验证业务服务按远程配置启动

启动 movies-service 后，访问：

```bash
curl http://localhost:3001/api/config/info
```

或浏览器访问：http://localhost:3001/api/config/info

应返回从 Config Server 加载的配置信息：
```json
{
  "appName": "电影评分系统",
  "appVersion": "1.0.0-dev",
  "appDescription": "开发环境",
  "appAuthor": "操祥睿",
  "serverPort": "3001",
  "source": "Config Server"
}
```

### 3. 验证配置动态刷新

**步骤 1**: 查看当前配置
```bash
curl http://localhost:3001/api/config/info
```

**步骤 2**: 修改 Git 仓库中的配置文件

```bash
# 编辑配置文件
vim ~/.config-repo/movies-service/movies-service-dev.yml

# 修改 app.description 为 "开发环境-已更新"
```

**步骤 3**: 提交修改到 Git 仓库

```bash
cd ~/.config-repo
git add .
git commit -m "更新开发环境配置"
```

**步骤 4**: 发送刷新请求（无需重启服务）

```bash
curl -X POST http://localhost:3001/actuator/refresh
```

返回结果示例：
```json
["app.description"]
```

表示 `app.description` 配置已更新。

**步骤 5**: 再次查看配置，确认已更新

```bash
curl http://localhost:3001/api/config/info
```

应看到 `appDescription` 变为 "开发环境-已更新"。

### 4. 验证多环境配置切换

**dev 环境**（默认）：
```bash
# 启动时默认加载 dev 配置
curl http://localhost:3001/api/config/info
# 端口: 3001, 版本: 1.0.0-dev
```

**切换到 test 环境**：

编辑 `src/main/resources/application.yml`，修改：
```yaml
spring:
  cloud:
    config:
      profile: test  # 改为 test
```

重启服务后访问：
```bash
curl http://localhost:3002/api/config/info
# 端口: 3002, 版本: 1.0.0-test
```

**切换到 prod 环境**：

编辑 `src/main/resources/application.yml`，修改：
```yaml
spring:
  cloud:
    config:
      profile: prod  # 改为 prod
```

重启服务后访问：
```bash
curl http://localhost:8080/api/config/info
# 端口: 8080, 版本: 1.0.0-prod
```

---

## 配置文件说明

### Config Server 配置

`config-server/src/main/resources/application.yml`:
- 端口: 8888
- Git 仓库: `file://${user.home}/.config-repo`
- 支持本地 Git 仓库

### Config Client 配置

`src/main/resources/application.yml`:
- 从 `http://localhost:8888` 导入配置
- 默认 profile: dev
- Actuator 暴露 refresh 端点

### Git 仓库中的配置文件

`~/.config-repo/movies-service/`:
- `movies-service-dev.yml` - 开发环境
- `movies-service-test.yml` - 测试环境
- `movies-service-prod.yml` - 生产环境

---

## 关键代码说明

### @RefreshScope 注解

在 `JwtService` 和 `ConfigDemoController` 上添加了 `@RefreshScope` 注解，
使得这些 Bean 可以在配置刷新时自动重新创建，加载新的配置值。

### Actuator 配置

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,refresh,env
```

暴露 `/actuator/refresh` 端点用于手动刷新配置。

---

## 常见问题

### 1. Config Server 无法启动

检查 Git 仓库是否存在：
```bash
ls -la ~/.config-repo/.git
```

如果不存在，创建并初始化：
```bash
mkdir -p ~/.config-repo/movies-service
cd ~/.config-repo
git init
```

### 2. 客户端无法连接到 Config Server

确保 Config Server 已启动，且客户端配置的 URL 正确：
```yaml
spring.config.import: "optional:configserver:http://localhost:8888"
```

### 3. 配置不生效

检查配置文件名是否符合规范：
- `{application-name}-{profile}.yml`
- 例如: `movies-service-dev.yml`

### 4. 动态刷新失败

确保：
1. Bean 上有 `@RefreshScope` 注解
2. Actuator 已暴露 refresh 端点
3. 发送的是 POST 请求
4. Git 提交已完成

---

## 技术栈

- Spring Boot 3.4.1
- Spring Cloud 2024.0.1
- Spring Cloud Config Server
- Spring Cloud Config Client
- Spring Boot Actuator
- Eureka Client
