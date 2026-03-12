package edu.cuit.yingpingsxitong.Controller;

import edu.cuit.yingpingsxitong.Auth.AdminOnly;
import edu.cuit.yingpingsxitong.Auth.AuthConstants;
import edu.cuit.yingpingsxitong.Auth.Authenticated;
import edu.cuit.yingpingsxitong.Entity.Movie;
import edu.cuit.yingpingsxitong.Entity.Review;
import edu.cuit.yingpingsxitong.Entity.User;
import edu.cuit.yingpingsxitong.Service.MovieService;
import edu.cuit.yingpingsxitong.Service.ReviewService;
import edu.cuit.yingpingsxitong.Service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewApiController {
    private final ReviewService reviewService;
    private final UserService userService;
    private final MovieService movieService;

    @Autowired
    public ReviewApiController(ReviewService reviewService, UserService userService, MovieService movieService) {
        this.reviewService = reviewService;
        this.userService = userService;
        this.movieService = movieService;
    }

    @GetMapping
    public List<Review> listReviews(
            @RequestParam(value = "movieId", required = false) Integer movieId,
            @RequestParam(value = "userId", required = false) Integer userId
    ) {
        List<Review> reviews;
        if (movieId != null) {
            reviews = reviewService.findReviewsByMovieId(movieId);
        } else if (userId != null) {
            reviews = reviewService.findReviewsByUserId(userId);
        } else {
            reviews = reviewService.findAllReviews();
        }
        fillDerivedFields(reviews);
        return reviews;
    }

    @PostMapping
    @Authenticated
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequest request, HttpServletRequest httpRequest) {
        User currentUser = (User) httpRequest.getAttribute(AuthConstants.AUTHENTICATED_USER);
        Review review = new Review(request.movieId(), currentUser.getUserId(), request.content(), request.score(), new Date());
        reviewService.insertReview(review);
        movieService.updateAverageScore(request.movieId());
        fillDerivedField(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    @DeleteMapping("/{reviewId}")
    @AdminOnly
    public ResponseEntity<Void> deleteReview(@PathVariable Integer reviewId) {
        Review review = reviewService.findReviewById(reviewId);
        if (review == null) {
            return ResponseEntity.notFound().build();
        }
        reviewService.deleteReview(reviewId);
        movieService.updateAverageScore(review.getMovieId());
        return ResponseEntity.noContent().build();
    }

    private void fillDerivedFields(List<Review> reviews) {
        for (Review review : reviews) {
            fillDerivedField(review);
        }
    }

    private void fillDerivedField(Review review) {
        User user = userService.findUserById(review.getUserId());
        Movie movie = movieService.findMovieById(review.getMovieId());
        if (user != null) {
            review.setUsername(user.getUsername());
        }
        if (movie != null) {
            review.setTitle(movie.getTitle());
        }
    }

    public record ReviewRequest(Integer movieId, String content, Integer score) {
    }
}
