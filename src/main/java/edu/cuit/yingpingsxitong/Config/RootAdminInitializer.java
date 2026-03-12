package edu.cuit.yingpingsxitong.Config;

import edu.cuit.yingpingsxitong.Entity.User;
import edu.cuit.yingpingsxitong.Service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RootAdminInitializer {
    @Bean
    public CommandLineRunner seedRootAdmin(UserService userService) {
        return args -> {
            User rootUser = userService.findUserByUsername("root");
            if (rootUser == null) {
                rootUser = new User("root", "root", "root@movies.local");
            }

            rootUser.setUsername("root");
            rootUser.setPassword("root");
            rootUser.setEmail("root@movies.local");
            rootUser.setManager(true);
            rootUser.setPermission(true);

            userService.insertUser(rootUser);
        };
    }
}
