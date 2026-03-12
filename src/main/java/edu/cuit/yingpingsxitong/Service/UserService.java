package edu.cuit.yingpingsxitong.Service;

import edu.cuit.yingpingsxitong.Config.SequenceGeneratorService;
import edu.cuit.yingpingsxitong.Entity.User;
import edu.cuit.yingpingsxitong.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final SequenceGeneratorService sequenceGeneratorService;

    @Autowired
    public UserService(UserRepository userRepository, SequenceGeneratorService sequenceGeneratorService) {
        this.userRepository = userRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    public void insertUser(User user) {
        if (user.getUserId() == null) {
            user.setUserId(sequenceGeneratorService.getNextSequence("user_sequence"));
        }
        if (user.getManager() == null) {
            user.setManager(false);
        }
        if (user.getPermission() == null) {
            user.setPermission(true);
        }
        userRepository.save(user);
    }

    public User findUserById(int id) {
        return userRepository.findById(id).orElse(null);
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    public void updateUser(User user) {
        userRepository.save(user);
    }

    public void deleteUser(Integer userId) {
        userRepository.deleteById(userId);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public void updatePermission(Integer userId, Boolean permission) {
        User user = findUserById(userId);
        if (user != null) {
            user.setPermission(permission);
            userRepository.save(user);
        }
    }

    public void updateManager(Integer userId, Boolean manager) {
        User user = findUserById(userId);
        if (user != null) {
            user.setManager(manager);
            userRepository.save(user);
        }
    }
}
