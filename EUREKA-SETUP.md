# Eureka 微服务架构启动指南

## 项目结构

```
Movies/
├── eureka-server/          # Eureka 注册中心 (端口: 8761)
├── gateway/                # API 网关 (端口: 3000)
├── src/                    # 主服务 (端口: 3001)
└── frontend/               # 前端应用 (端口: 3002)
```

## 启动顺序

### 1. 启动 Eureka Server（注册中心）

```bash
cd eureka-server
mvn spring-boot:run
```

访问控制台: http://localhost:8761

### 2. 启动主服务（服务提供者）

```bash
cd /Users/caoxiangrui/Desktop/学习/大三下/weifuwu/Movies
mvn spring-boot:run
```

### 3. 启动 Gateway（服务消费者）

```bash
cd gateway
mvn spring-boot:run
```

### 4. 启动前端（可选）

```bash
cd frontend
npm run dev
```

## 验证服务注册

启动后访问 Eureka 控制台: http://localhost:8761

应看到以下服务注册:
- `MOVIES-SERVICE` (主服务)
- `MOVIES-GATEWAY` (网关)

## 关键配置说明

### Eureka Server (`eureka-server/application.yml`)
- `@EnableEurekaServer` - 启用注册中心
- `register-with-eureka: false` - 不向自己注册
- `fetch-registry: false` - 不从自己获取注册表

### 服务提供者 (`movies-service`)
- `@EnableDiscoveryClient` - 启用服务发现客户端
- `eureka.client.service-url.defaultZone` - 注册中心地址
- 服务名: `movies-service`

### 服务消费者 (Gateway)
- `@EnableDiscoveryClient` - 启用服务发现
- `uri: lb://movies-service` - 使用服务名路由，支持负载均衡
- `spring.cloud.gateway.discovery.locator.enabled: true` - 自动发现服务

## 测试负载均衡

启动多个主服务实例（不同端口）:

```bash
# 实例 1
cd /Users/caoxiangrui/Desktop/学习/大三下/weifuwu/Movies
mvn spring-boot:run -Dspring-boot.run.arguments='--server.port=3001'

# 实例 2
mvn spring-boot:run -Dspring-boot.run.arguments='--server.port=3003'
```

访问 http://localhost:8761 查看多个实例注册情况。

Gateway 会自动将请求负载均衡到多个实例。
