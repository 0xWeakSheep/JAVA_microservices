package edu.cuit.yingpingsxitong.Repository;

import edu.cuit.yingpingsxitong.Entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, Integer> {
    List<Review> findByMovieIdOrderByCreatedAtDesc(Integer movieId);

    List<Review> findByUserId(Integer userId);

    List<Review> findAllByOrderByCreatedAtDesc();
}
