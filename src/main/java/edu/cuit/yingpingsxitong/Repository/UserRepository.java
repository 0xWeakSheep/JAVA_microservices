package edu.cuit.yingpingsxitong.Repository;

import edu.cuit.yingpingsxitong.Entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, Integer> {
    Optional<User> findByUsername(String username);
}
