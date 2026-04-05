#!/bin/bash

# Spring Cloud Config Server 测试脚本
# 用于验证配置中心的各项功能

echo "=========================================="
echo "Spring Cloud Config Server 功能测试脚本"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查服务是否启动的函数
check_service() {
    local url=$1
    local name=$2
    echo -n "检查 $name ($url) ... "
    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}运行中${NC}"
        return 0
    else
        echo -e "${RED}未启动${NC}"
        return 1
    fi
}

echo "1. 检查服务状态"
echo "----------------"
check_service "http://localhost:8761" "Eureka Server"
check_service "http://localhost:8888" "Config Server"
check_service "http://localhost:3001/api/config/info" "Movies Service"
echo ""

# 测试 Config Server 提供配置接口
echo "2. 测试 Config Server 配置接口"
echo "-------------------------------"
echo "获取 dev 环境配置:"
curl -s "http://localhost:8888/movies-service/dev" | head -20
echo ""
echo ""

# 测试业务服务配置信息
echo "3. 测试业务服务配置信息"
echo "----------------------"
echo "当前加载的配置:"
curl -s "http://localhost:3001/api/config/info" | python3 -m json.tool 2>/dev/null || curl -s "http://localhost:3001/api/config/info"
echo ""
echo ""

# 测试动态刷新
echo "4. 测试配置动态刷新"
echo "------------------"
echo "步骤 1: 记录当前配置"
ORIGINAL_DESC=$(curl -s "http://localhost:3001/api/config/info" | grep -o '"appDescription":"[^"]*"' | cut -d'"' -f4)
echo "当前 appDescription: $ORIGINAL_DESC"
echo ""

echo "步骤 2: 修改 Git 配置文件"
cd ~/.config-repo
NEW_DESC="开发环境-已刷新-$(date +%H%M%S)"
sed -i.bak "s/description: .*/description: $NEW_DESC/" movies-service/movies-service-dev.yml
git add .
git commit -m "测试动态刷新: $NEW_DESC" > /dev/null 2>&1
echo "已修改配置并提交到 Git"
echo "新描述: $NEW_DESC"
echo ""

echo "步骤 3: 发送刷新请求"
REFRESH_RESULT=$(curl -s -X POST http://localhost:3001/actuator/refresh)
echo "刷新结果: $REFRESH_RESULT"
echo ""

echo "步骤 4: 验证配置已更新"
sleep 2
UPDATED_DESC=$(curl -s "http://localhost:3001/api/config/info" | grep -o '"appDescription":"[^"]*"' | cut -d'"' -f4)
echo "更新后 appDescription: $UPDATED_DESC"
echo ""

if [ "$UPDATED_DESC" = "$NEW_DESC" ]; then
    echo -e "${GREEN}✓ 动态刷新测试通过!${NC}"
else
    echo -e "${RED}✗ 动态刷新测试失败${NC}"
fi
echo ""

# 恢复原始配置
echo "恢复原始配置..."
cd ~/.config-repo
mv movies-service/movies-service-dev.yml.bak movies-service/movies-service-dev.yml
git add .
git commit -m "恢复原始配置" > /dev/null 2>&1
echo "已恢复"
echo ""

# 显示所有环境的配置
echo "5. 多环境配置概览"
echo "-----------------"
echo "dev 环境端口:"
curl -s "http://localhost:8888/movies-service/dev" | grep "server.port"
echo "test 环境端口:"
curl -s "http://localhost:8888/movies-service/test" | grep "server.port"
echo "prod 环境端口:"
curl -s "http://localhost:8888/movies-service/prod" | grep "server.port"
echo ""

echo "=========================================="
echo "测试完成!"
echo "=========================================="
