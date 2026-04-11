package edu.cuit.filter;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

/**
 * 参数校验前置过滤器
 * 优先级：3
 * 功能：检查请求参数的合法性
 */
@Component
public class ParamCheckPreFilter extends ZuulFilter {

    private static final Logger logger = LoggerFactory.getLogger(ParamCheckPreFilter.class);

    @Override
    public String filterType() {
        return "pre";  // 前置过滤器
    }

    @Override
    public int filterOrder() {
        return 3;  // 优先级为3，在最后执行
    }

    @Override
    public boolean shouldFilter() {
        return true;  // 对所有请求都执行
    }

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();

        logger.info("=== [ParamCheckPreFilter] 优先级3 - 参数校验 ===");

        // 获取之前过滤器存储的信息
        Long startTime = (Long) ctx.get("startTime");
        String authToken = (String) ctx.get("authToken");

        if (startTime != null) {
            long elapsedTime = System.currentTimeMillis() - startTime;
            logger.info("过滤器链执行耗时: {} ms", elapsedTime);
        }

        if (authToken != null) {
            logger.info("已获取认证Token，来自AuthPreFilter");
        }

        // 检查请求参数中是否包含非法字符（简单示例）
        String param = request.getParameter("name");
        if (param != null) {
            if (param.contains("<") || param.contains(">") || param.contains("script")) {
                logger.warn("参数校验失败: 检测到非法字符");
                logger.info("==============================================");

                ctx.setSendZuulResponse(false);
                ctx.setResponseStatusCode(400);
                ctx.setResponseBody("{\"error\": \"请求参数不合法\", \"message\": \"参数包含非法字符\"}");
                ctx.getResponse().setContentType("application/json;charset=UTF-8");
                return null;
            }
            logger.info("参数 'name' 校验通过: {}", param);
        }

        // 检查appId参数
        String appId = request.getParameter("appId");
        if (appId != null) {
            logger.info("收到appId参数: {}", appId);
        }

        logger.info("所有前置过滤器执行完成，准备转发请求");
        logger.info("==============================================");

        return null;
    }
}
