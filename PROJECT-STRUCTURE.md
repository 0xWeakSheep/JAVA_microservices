# 项目结构说明 - 第3次作业：分布式配置中心

## 学号姓名
- 学号：2023131016
- 姓名：操祥睿

## 作业完成内容

根据实验要求，完成了以下四项任务：

### ✅ 任务1：搭建配置中心服务端（Config Server）

**文件位置**：`config-server/`

**实现内容**：
- 创建了独立的 config-server 模块
- 配置了 Spring Cloud Config Server
- 连接本地 Git 仓库（`~/.config-repo`）
- 端口：8888
- 访问地址：http://localhost:8888

**验证方式**：
浏览器访问以下地址可返回 JSON 格式的配置内容：
- `http://localhost:8888/movies-service/dev`
- `http://localhost:8888/movies-service/test`
- `http://localhost:8888/movies-service/prod`

### ✅ 任务2：改造业务服务为配置客户端（Config Client）

**文件位置**：`src/main/java/edu/cuit/yingpingsxitong/`

**实现内容**：
- 添加了 `spring-cloud-starter-config` 依赖（pom.xml）
- 添加了 `spring-boot-starter-actuator` 依赖
- 创建了 `application.yml` 指向 Config Server
- 删除了本地 `application.properties` 文件
- 服务启动时自动从 Config Server 拉取配置

**配置说明**：
```yaml
spring:
  config:
    import: "optional:configserver:http://localhost:8888"
  cloud:
    config:
      profile: dev  # 默认使用 dev 环境
```

### ✅ 任务3：实现配置的动态刷新

**文件位置**：
- `src/main/java/edu/cuit/yingpingsxitong/Auth/JwtService.java`
- `src/main/java/edu/cuit/yingpingsxitong/Controller/ConfigDemoController.java`

**实现内容**：
- 在需要动态刷新的 Bean 上添加 `@RefreshScope` 注解
- 配置了 Actuator 暴露 `/actuator/refresh` 端点
- 实现了无需重启服务即可刷新配置

**验证方式**：
1. 修改 Git 仓库中的配置文件
2. 提交到 Git：`git commit -m "更新配置"`
3. 发送 POST 请求：`curl -X POST http://localhost:3001/actuator/refresh`
4. 配置实时生效，无需重启服务

**演示控制器**：`ConfigDemoController`
- 访问 `/api/config/info` 可查看当前配置
- 修改配置后刷新，再次访问即可看到更新

### ✅ 任务4：验证多环境配置切换

**文件位置**：`~/.config-repo/movies-service/`

**实现内容**：
- 创建了 `movies-service-dev.yml`（开发环境）
- 创建了 `movies-service-test.yml`（测试环境）
- 创建了 `movies-service-prod.yml`（生产环境）

**各环境配置差异**：

| 环境 | 端口 | 数据库 | JWT过期时间 | 描述 |
|------|------|--------|-------------|------|
| dev | 3001 | polymarket_db | 24小时 | 开发环境 |
| test | 3002 | polymarket_db_test | 12小时 | 测试环境 |
| prod | 8080 | polymarket_db_prod | 1小时 | 生产环境 |

**切换方式**：
修改 `src/main/resources/application.yml` 中的 `spring.cloud.config.profile` 值：
- `profile: dev` - 使用开发环境
- `profile: test` - 使用测试环境
- `profile: prod` - 使用生产环境

---

## 项目目录结构

```
Movies/
├── config-server/                          # 配置中心服务端
│   ├── src/main/java/edu/cuit/configserver/
│   │   └── ConfigServerApplication.java    # Config Server 启动类
│   ├── src/main/resources/
│   │   └── application.yml                 # Config Server 配置
│   └── pom.xml
│
├── eureka-server/                          # Eureka 注册中心
│   ├── src/main/java/edu/cuit/eurekaserver/
│   │   └── EurekaServerApplication.java
│   └── src/main/resources/
│       └── application.yml
│
├── gateway/                                # API 网关
│   ├── src/main/java/edu/cuit/moviesgateway/
│   │   └── MoviesGatewayApplication.java
│   └── src/main/resources/
│       └── application.yml
│
├── src/                                    # 主业务服务（movies-service）
│   └── main/java/edu/cuit/yingpingsxitong/
│       ├── YingpingsxitongApplication.java # 服务启动类
│       ├── Auth/
│       │   └── JwtService.java             # 添加 @RefreshScope
│       ├── Controller/
│       │   ├── AuthApiController.java
│       │   ├── ConfigDemoController.java   # 配置演示控制器（新增）
│       │   ├── LogApiController.java
│       │   ├── MovieApiController.java
│       │   ├── ReviewApiController.java
│       │   └── UserApiController.java
│       ├── Entity/
│       ├── Repository/
│       ├── Service/
│       ├── Config/
│       ├── Aspect/
│       └── Dto/
│   └── main/resources/
│       └── application.yml                 # Config Client 配置（新增）
│
├── frontend/                               # Next.js 前端
│
├── ~/.config-repo/                         # 本地 Git 配置仓库
│   └── movies-service/
│       ├── movies-service-dev.yml          # 开发环境配置
│       ├── movies-service-test.yml         # 测试环境配置
│       └── movies-service-prod.yml         # 生产环境配置
│
├── pom.xml                                 # 主项目依赖（添加 config client）
├── EUREKA-SETUP.md                         # Eureka 启动指南
├── CONFIG-SERVER-SETUP.md                  # 配置中心详细指南
├── start-all.sh                            # 一键启动所有服务脚本
└── test-config-server.sh                   # 配置中心测试脚本
```

---

## 启动步骤

### 方式一：手动逐个启动

```bash
# 1. 启动 Eureka Server
cd eureka-server
mvn spring-boot:run

# 2. 启动 Config Server（新窗口）
cd config-server
mvn spring-boot:run

# 3. 启动 Movies Service（新窗口）
cd /Users/caoxiangrui/Desktop/学习/大三下/weifuwu/Movies
mvn spring-boot:run

# 4. 启动 Gateway（新窗口）
cd gateway
mvn spring-boot:run
```

### 方式二：使用一键启动脚本

```bash
./start-all.sh
```

---

## 验证步骤

### 1. 验证 Config Server 配置接口

浏览器访问以下地址，应返回 JSON 格式的配置内容：
- `http://localhost:8888/movies-service/dev`
- `http://localhost:8888/movies-service/test`
- `http://localhost:8888/movies-service/prod`

### 2. 验证业务服务使用远程配置

```bash
# 访问业务服务的配置信息接口
curl http://localhost:3001/api/config/info

# 应返回类似以下内容：
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

```bash
# 1. 修改 ~/.config-repo/movies-service/movies-service-dev.yml 中的配置
# 2. 提交到 Git：cd ~/.config-repo && git add . && git commit -m "更新"
# 3. 发送刷新请求
curl -X POST http://localhost:3001/actuator/refresh

# 4. 验证配置已更新
curl http://localhost:3001/api/config/info
```

### 4. 验证多环境切换

修改 `src/main/resources/application.yml`：
```yaml
spring:
  cloud:
    config:
      profile: test  # 或 prod
```

重启服务后访问 `http://localhost:3001/api/config/info`，
应看到对应环境的配置（如端口、版本号等）。

---

## 关键代码片段

### Config Server 启动类

```java
@SpringBootApplication
@EnableConfigServer
@EnableDiscoveryClient
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}
```

### Config Client 配置（application.yml）

```yaml
spring:
  application:
    name: movies-service
  config:
    import: "optional:configserver:http://localhost:8888"
  cloud:
    config:
      profile: dev
```

### 动态刷新支持（@RefreshScope）

```java
@Service
@RefreshScope
public class JwtService {
    @Value("${app.auth.jwt-secret}")
    private String jwtSecret;
    // ...
}
```

---

## 使用脚本

### 测试脚本

```bash
./test-config-server.sh
```

自动执行以下测试：
1. 检查所有服务是否启动
2. 测试 Config Server 配置接口
3. 测试业务服务配置信息
4. 测试配置动态刷新功能
5. 显示多环境配置概览

---

## 端口说明

| 服务 | 端口 | 访问地址 |
|------|------|----------|
| Eureka Server | 8761 | http://localhost:8761 |
| Config Server | 8888 | http://localhost:8888 |
| Movies Service (dev) | 3001 | http://localhost:3001 |
| Movies Service (test) | 3002 | http://localhost:3002 |
| Movies Service (prod) | 8080 | http://localhost:8080 |
| Gateway | 3000 | http://localhost:3000 |
| Frontend | 3002 | http://localhost:3002 |

---

## 参考资料

- [CONFIG-SERVER-SETUP.md](./CONFIG-SERVER-SETUP.md) - 配置中心详细使用指南
- [EUREKA-SETUP.md](./EUREKA-SETUP.md) - Eureka 微服务启动指南
- [README.md](./README.md) - 项目总体说明
