package edu.cuit.yingpingsxitong.Auth;

import edu.cuit.yingpingsxitong.Entity.User;
import edu.cuit.yingpingsxitong.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;

@Component
public class JwtAuthInterceptor implements HandlerInterceptor {
    private final JwtService jwtService;
    private final UserService userService;

    public JwtAuthInterceptor(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        boolean adminOnly = hasAnnotation(handlerMethod, AdminOnly.class);
        boolean authenticated = adminOnly || hasAnnotation(handlerMethod, Authenticated.class);
        if (!authenticated) {
            return true;
        }

        String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            writeJsonError(response, HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid authorization token");
            return false;
        }

        String token = authorization.substring(7).trim();
        Integer userId = jwtService.extractUserId(token);
        if (userId == null) {
            writeJsonError(response, HttpServletResponse.SC_UNAUTHORIZED, "Token is invalid or expired");
            return false;
        }

        User user = userService.findUserById(userId);
        if (user == null) {
            writeJsonError(response, HttpServletResponse.SC_UNAUTHORIZED, "User not found");
            return false;
        }
        if (!Boolean.TRUE.equals(user.getPermission())) {
            writeJsonError(response, HttpServletResponse.SC_FORBIDDEN, "No permission");
            return false;
        }

        request.setAttribute(AuthConstants.AUTHENTICATED_USER, user);

        if (adminOnly && !Boolean.TRUE.equals(user.getManager())) {
            writeJsonError(response, HttpServletResponse.SC_FORBIDDEN, "Admin permission required");
            return false;
        }

        return true;
    }

    private boolean hasAnnotation(HandlerMethod handlerMethod, Class annotationClass) {
        return handlerMethod.hasMethodAnnotation(annotationClass)
                || handlerMethod.getBeanType().isAnnotationPresent(annotationClass);
    }

    private void writeJsonError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"message\":\"" + message + "\"}");
    }
}
