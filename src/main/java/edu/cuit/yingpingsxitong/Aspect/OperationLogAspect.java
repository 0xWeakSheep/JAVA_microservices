package edu.cuit.yingpingsxitong.Aspect;

import edu.cuit.yingpingsxitong.Auth.AuthConstants;
import edu.cuit.yingpingsxitong.Entity.User;
import edu.cuit.yingpingsxitong.Service.LogService;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class OperationLogAspect {
    private final LogService logService;

    public OperationLogAspect(LogService logService) {
        this.logService = logService;
    }

    @AfterReturning("within(edu.cuit.yingpingsxitong.Controller..*)")
    public void logOperation(JoinPoint joinPoint) {
        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
        if (!(requestAttributes instanceof ServletRequestAttributes servletRequestAttributes)) {
            return;
        }

        HttpServletRequest request = servletRequestAttributes.getRequest();
        if ("/api/logs".equals(request.getRequestURI())) {
            return;
        }

        Object currentUser = request.getAttribute(AuthConstants.AUTHENTICATED_USER);
        if (!(currentUser instanceof User user)) {
            return;
        }

        String action = request.getMethod() + " " + request.getRequestURI() + " -> " + joinPoint.getSignature().getName();
        logService.saveLog(action, user.getUsername());
    }
}
