package edu.cuit.yingpingsxitong.Repository;

import edu.cuit.yingpingsxitong.Entity.Log;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface LogRepository extends MongoRepository<Log, Integer> {
    List<Log> findAllByOrderByTimestampDesc();
}
