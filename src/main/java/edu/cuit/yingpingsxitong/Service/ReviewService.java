package edu.cuit.yingpingsxitong.Service;

import edu.cuit.yingpingsxitong.Config.SequenceGeneratorService;
import edu.cuit.yingpingsxitong.Entity.Review;
import edu.cuit.yingpingsxitong.Repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final SequenceGeneratorService sequenceGeneratorService;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, SequenceGeneratorService sequenceGeneratorService) {
        this.reviewRepository = reviewRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    public void insertReview(Review review) {
        if (review.getReviewId() == null) {
            review.setReviewId(sequenceGeneratorService.getNextSequence("review_sequence"));
        }
        reviewRepository.save(review);
    }

    public Review findReviewById(Integer reviewId) {
        return reviewRepository.findById(reviewId).orElse(null);
    }

    public List<Review> findReviewsByMovieId(Integer movieId) {
        return reviewRepository.findByMovieIdOrderByCreatedAtDesc(movieId);
    }

    public List<Review> findReviewsByUserId(Integer userId) {
        return reviewRepository.findByUserId(userId);
    }

    public void updateReview(Review review) {
        reviewRepository.save(review);
    }

    public void deleteReview(Integer reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    public List<Review> findAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }
}
