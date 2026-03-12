# 项目架构图

```mermaid
flowchart LR
    U[用户浏览器]

    subgraph Client[前端层]
        F[Next.js 前端<br/>React 19 / TypeScript<br/>Port 3002]
    end

    subgraph Gateway[接入层]
        G[Spring Cloud Gateway<br/>统一入口 / 路由转发<br/>Port 3000]
    end

    subgraph Backend[业务层]
        B[Spring Boot 后端<br/>REST API / JWT 鉴权 / AOP 日志<br/>Port 3001]
        C1[Controller]
        C2[Service]
        C3[Repository]
    end

    subgraph Data[数据层]
        M[(MongoDB)]
        M1[(users)]
        M2[(movies)]
        M3[(reviews)]
        M4[(logs)]
        M5[(database_sequences)]
    end

    U --> G
    G -->|/**| F
    G -->|/api/**| B

    F -->|fetch / axios 调用接口| G

    B --> C1 --> C2 --> C3 --> M
    M --> M1
    M --> M2
    M --> M3
    M --> M4
    M --> M5
```

```text
访问路径说明
1. 用户统一访问网关入口：http://localhost:3000
2. 网关将 /api/** 转发到 Spring Boot 后端：http://localhost:3001
3. 网关将 /** 转发到 Next.js 前端：http://localhost:3002
4. 后端通过 MongoDB 完成用户、电影、评论、日志与序列号数据读写
```
