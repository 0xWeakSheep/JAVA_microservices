package edu.cuit.yingpingsxitong.Repository;

import edu.cuit.yingpingsxitong.Entity.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MovieRepository extends MongoRepository<Movie, Integer> {
}
