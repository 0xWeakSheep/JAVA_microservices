package edu.cuit.yingpingsxitong.Controller;

import edu.cuit.yingpingsxitong.Entity.User;
import edu.cuit.yingpingsxitong.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserApiController {
    private final UserService userService;

    @Autowired
    public UserApiController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> listUsers() {
        return userService.findAllUsers();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUser(@PathVariable Integer userId) {
        User user = userService.findUserById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{userId}/permission")
    public ResponseEntity<User> updatePermission(@PathVariable Integer userId, @RequestParam("value") Boolean value) {
        userService.updatePermission(userId, value);
        User user = userService.findUserById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{userId}/manager")
    public ResponseEntity<User> updateManager(@PathVariable Integer userId, @RequestParam("value") Boolean value) {
        userService.updateManager(userId, value);
        User user = userService.findUserById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
}
