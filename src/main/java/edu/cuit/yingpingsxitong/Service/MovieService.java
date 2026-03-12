package edu.cuit.yingpingsxitong.Service;

import edu.cuit.yingpingsxitong.Config.SequenceGeneratorService;
import edu.cuit.yingpingsxitong.Entity.Movie;
import edu.cuit.yingpingsxitong.Entity.Review;
import edu.cuit.yingpingsxitong.Repository.MovieRepository;
import edu.cuit.yingpingsxitong.Repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {
    private final MovieRepository movieRepository;
    private final ReviewRepository reviewRepository;
    private final SequenceGeneratorService sequenceGeneratorService;
    private final MongoTemplate mongoTemplate;

    @Autowired
    public MovieService(
            MovieRepository movieRepository,
            ReviewRepository reviewRepository,
            SequenceGeneratorService sequenceGeneratorService,
            MongoTemplate mongoTemplate
    ) {
        this.movieRepository = movieRepository;
        this.reviewRepository = reviewRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
        this.mongoTemplate = mongoTemplate;
    }

    public void insertMovie(Movie movie) {
        if (movie.getMovieId() == null) {
            movie.setMovieId(sequenceGeneratorService.getNextSequence("movie_sequence"));
        }
        movieRepository.save(movie);
    }

    public Movie findMovieById(Integer movieId) {
        return movieRepository.findById(movieId).orElse(null);
    }

    public List<Movie> findAllMovies() {
        return movieRepository.findAll(Sort.by(Sort.Direction.DESC, "averageScore"));
    }

    public List<Movie> getSearchList(String title) {
        Query query = new Query();
        query.addCriteria(Criteria.where("title").regex(title, "i"));
        query.with(Sort.by(Sort.Direction.DESC, "averageScore"));
        return mongoTemplate.find(query, Movie.class);
    }

    public void updateMovie(Movie movie) {
        movieRepository.save(movie);
    }

    public void deleteMovie(Integer movieId) {
        movieRepository.deleteById(movieId);
    }

    public void updateAverageScore(Integer movieId) {
        Movie movie = findMovieById(movieId);
        if (movie == null) {
            return;
        }

        List<Review> reviews = reviewRepository.findByMovieIdOrderByCreatedAtDesc(movieId);
        if (reviews.isEmpty()) {
            movie.setAverageScore(0.0d);
        } else {
            double avg = reviews.stream().mapToInt(Review::getScore).average().orElse(0.0d);
            double rounded = Math.round(avg * 10.0d) / 10.0d;
            movie.setAverageScore(rounded);
        }
        movieRepository.save(movie);
    }
}
