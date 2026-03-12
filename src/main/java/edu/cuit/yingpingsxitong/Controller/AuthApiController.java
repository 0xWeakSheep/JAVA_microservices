package edu.cuit.yingpingsxitong.Controller;

import edu.cuit.yingpingsxitong.Auth.AuthConstants;
import edu.cuit.yingpingsxitong.Auth.Authenticated;
import edu.cuit.yingpingsxitong.Auth.JwtService;
import edu.cuit.yingpingsxitong.Dto.AuthResponse;
import edu.cuit.yingpingsxitong.Entity.User;
import edu.cuit.yingpingsxitong.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {
    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    public AuthApiController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userService.findUserByUsername(request.username());
        if (user == null || !user.getPassword().equals(request.password())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid username or password"));
        }
        if (!Boolean.TRUE.equals(user.getPermission())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "No permission"));
        }
        return ResponseEntity.ok(new AuthResponse(jwtService.generateToken(user), user));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        User existing = userService.findUserByUsername(request.username());
        if (existing != null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }
        User user = new User(request.username(), request.password(), request.email());
        userService.insertUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @Authenticated
    @GetMapping("/me")
    public ResponseEntity<User> me(HttpServletRequest request) {
        User user = (User) request.getAttribute(AuthConstants.AUTHENTICATED_USER);
        return ResponseEntity.ok(user);
    }

    public record LoginRequest(String username, String password) {
    }

    public record RegisterRequest(String username, String password, String email) {
    }
}
