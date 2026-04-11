package edu.cuit.filter;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 日志记录前置过滤器
 * 优先级：1（数字越小优先级越高）
 * 功能：记录所有请求的日志信息
 */
@Component
public class LoggerPreFilter extends ZuulFilter {

    private static final Logger logger = LoggerFactory.getLogger(LoggerPreFilter.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public String filterType() {
        return "pre";  // 前置过滤器
    }

    @Override
    public int filterOrder() {
        return 1;  // 优先级为1，最先执行
    }

    @Override
    public boolean shouldFilter() {
        return true;  // 对所有请求都执行
    }

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();

        String timestamp = LocalDateTime.now().format(formatter);
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String remoteAddr = request.getRemoteAddr();

        logger.info("=== [LoggerPreFilter] 优先级1 - 请求日志记录 ===");
        logger.info("请求时间: {}", timestamp);
        logger.info("请求方法: {}", method);
        logger.info("请求路径: {}", uri);
        logger.info("客户端IP: {}", remoteAddr);
        logger.info("==============================================");

        // 将时间戳存入上下文，供后续过滤器使用
        ctx.set("startTime", System.currentTimeMillis());

        return null;
    }
}
