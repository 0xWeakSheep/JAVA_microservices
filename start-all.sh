#!/bin/bash

# Spring Cloud 微服务启动脚本
# 用于按顺序启动所有服务

echo "=========================================="
echo "Spring Cloud 微服务启动脚本"
echo "=========================================="
echo ""

# 获取项目根目录
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# 启动 Eureka Server
echo "[1/4] 启动 Eureka Server (端口: 8761)..."
cd "$PROJECT_DIR/eureka-server"
nohup mvn spring-boot:run > "$PROJECT_DIR/eureka.log" 2>&1 &
EUREKA_PID=$!
echo "Eureka Server PID: $EUREKA_PID"
echo "日志: $PROJECT_DIR/eureka.log"
echo ""

# 等待 Eureka 启动
echo "等待 Eureka Server 启动..."
sleep 10

# 启动 Config Server
echo "[2/4] 启动 Config Server (端口: 8888)..."
cd "$PROJECT_DIR/config-server"
nohup mvn spring-boot:run > "$PROJECT_DIR/config.log" 2>&1 &
CONFIG_PID=$!
echo "Config Server PID: $CONFIG_PID"
echo "日志: $PROJECT_DIR/config.log"
echo ""

# 等待 Config Server 启动
echo "等待 Config Server 启动..."
sleep 10

# 启动主业务服务
echo "[3/4] 启动 Movies Service (端口: 3001)..."
cd "$PROJECT_DIR"
nohup mvn spring-boot:run > "$PROJECT_DIR/service.log" 2>&1 &
SERVICE_PID=$!
echo "Movies Service PID: $SERVICE_PID"
echo "日志: $PROJECT_DIR/service.log"
echo ""

# 启动 Gateway
echo "[4/4] 启动 Gateway (端口: 3000)..."
cd "$PROJECT_DIR/gateway"
nohup mvn spring-boot:run > "$PROJECT_DIR/gateway.log" 2>&1 &
GATEWAY_PID=$!
echo "Gateway PID: $GATEWAY_PID"
echo "日志: $PROJECT_DIR/gateway.log"
echo ""

# 保存 PID
echo "$EUREKA_PID $CONFIG_PID $SERVICE_PID $GATEWAY_PID" > "$PROJECT_DIR/.service_pids"

echo "=========================================="
echo "所有服务已启动!"
echo "=========================================="
echo ""
echo "服务访问地址:"
echo "  - Eureka Server:  http://localhost:8761"
echo "  - Config Server:  http://localhost:8888"
echo "  - Movies Service: http://localhost:3001"
echo "  - Gateway:        http://localhost:3000"
echo ""
echo "配置中心测试:"
echo "  - Dev 配置:  http://localhost:8888/movies-service/dev"
echo "  - 服务配置:  http://localhost:3001/api/config/info"
echo ""
echo "停止所有服务:"
echo "  kill $EUREKA_PID $CONFIG_PID $SERVICE_PID $GATEWAY_PID"
echo ""
