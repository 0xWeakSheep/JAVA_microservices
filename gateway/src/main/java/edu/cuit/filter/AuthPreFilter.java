package edu.cuit.filter;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

/**
 * 认证前置过滤器
 * 优先级：2
 * 功能：简单的Token认证检查
 */
@Component
public class AuthPreFilter extends ZuulFilter {

    private static final Logger logger = LoggerFactory.getLogger(AuthPreFilter.class);

    @Override
    public String filterType() {
        return "pre";  // 前置过滤器
    }

    @Override
    public int filterOrder() {
        return 2;  // 优先级为2，在LoggerPreFilter之后执行
    }

    @Override
    public boolean shouldFilter() {
        return true;  // 对所有请求都执行
    }

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();

        logger.info("=== [AuthPreFilter] 优先级2 - 认证检查 ===");

        // 获取请求头中的token
        String token = request.getHeader("Authorization");

        // 放行特定的路径（如登录、注册等）
        String uri = request.getRequestURI();
        if (uri.contains("/login") || uri.contains("/register") || uri.contains("/public")) {
            logger.info("公开路径，跳过认证: {}", uri);
            logger.info("==============================================");
            return null;
        }

        // 检查token是否存在
        if (token == null || token.isEmpty()) {
            logger.warn("认证失败: 未找到Authorization请求头");
            logger.info("==============================================");

            // 阻止请求继续转发
            ctx.setSendZuulResponse(false);
            ctx.setResponseStatusCode(401);
            ctx.setResponseBody("{\"error\": \"未授权访问\", \"message\": \"缺少Authorization请求头\"}");
            ctx.getResponse().setContentType("application/json;charset=UTF-8");
        } else {
            logger.info("认证通过，Token: {}", token.substring(0, Math.min(token.length(), 20)) + "...");
            logger.info("==============================================");

            // 将token存入上下文，供后续使用
            ctx.set("authToken", token);
        }

        return null;
    }
}
