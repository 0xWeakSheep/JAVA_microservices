# 项目架构图

## 1. 微服务注册与调用关系图

```mermaid
flowchart LR
    U[用户 / 浏览器]
    FE[前端应用<br/>Next.js<br/>Port 3002]

    subgraph Registry[注册中心]
        ES[Eureka Server<br/>服务注册与发现<br/>Port 8761]
    end

    subgraph Consumer[服务消费者]
        GW[Spring Cloud Gateway<br/>movies-gateway<br/>Port 3000]
    end

    subgraph Provider[服务提供者]
        MS[Spring Boot 业务服务<br/>movies-service<br/>Port 3001]
    end

    DB[(MongoDB)]

    U -->|访问系统入口| GW
    GW -->|/**| FE
    FE -->|调用 /api/**| GW
    GW -->|lb://movies-service| MS
    MS --> DB

    GW -.注册/续约.-> ES
    MS -.注册/续约.-> ES
    GW -.服务发现.-> ES
```

## 2. movies-service 内部包结构图

```mermaid
flowchart TD
    A[movies-service]
    A --> B[Controller 控制层]
    A --> C[Service 业务层]
    A --> D[Repository 数据访问层]
    A --> E[Entity / Dto 数据模型]
    A --> F[Auth 鉴权]
    A --> G[Aspect 日志切面]
    A --> H[Config 配置]
    D --> I[(MongoDB)]
```

```text
说明
1. Eureka Server 是服务注册中心，负责维护 movies-gateway 和 movies-service 的实例信息。
2. movies-service 是服务提供者，提供用户、电影、评论、日志等 REST API。
3. movies-gateway 是服务消费者和统一入口，通过 Eureka 发现并调用 movies-service。
4. 网关将 /** 转发到前端，将 /api/** 转发到 movies-service。
5. movies-service 通过 Repository 层访问 MongoDB。
```
