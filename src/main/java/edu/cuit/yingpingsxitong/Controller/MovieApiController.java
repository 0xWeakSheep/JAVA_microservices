package edu.cuit.yingpingsxitong.Controller;

import edu.cuit.yingpingsxitong.Entity.Movie;
import edu.cuit.yingpingsxitong.Service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieApiController {
    private final MovieService movieService;

    @Autowired
    public MovieApiController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public List<Movie> listMovies(@RequestParam(value = "title", required = false) String title) {
        if (title == null || title.isBlank()) {
            return movieService.findAllMovies();
        }
        return movieService.getSearchList(title);
    }

    @GetMapping("/{movieId}")
    public ResponseEntity<Movie> getMovie(@PathVariable Integer movieId) {
        Movie movie = movieService.findMovieById(movieId);
        if (movie == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(movie);
    }

    @PostMapping
    public ResponseEntity<Movie> createMovie(@RequestBody MovieRequest request) {
        Movie movie = new Movie(
                request.title(),
                request.description(),
                parseDate(request.releaseDate()),
                request.runtime(),
                request.posterImage()
        );
        movieService.insertMovie(movie);
        return ResponseEntity.status(HttpStatus.CREATED).body(movie);
    }

    @PutMapping("/{movieId}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Integer movieId, @RequestBody MovieRequest request) {
        Movie existing = movieService.findMovieById(movieId);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        existing.setTitle(request.title());
        existing.setDescription(request.description());
        existing.setReleaseDate(parseDate(request.releaseDate()));
        existing.setRuntime(request.runtime());
        existing.setPosterImage(request.posterImage());
        movieService.updateMovie(existing);
        return ResponseEntity.ok(existing);
    }

    @DeleteMapping("/{movieId}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Integer movieId) {
        movieService.deleteMovie(movieId);
        return ResponseEntity.noContent().build();
    }

    private Date parseDate(String releaseDate) {
        LocalDate localDate = LocalDate.parse(releaseDate);
        return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

    public record MovieRequest(String title, String description, String releaseDate, Integer runtime, String posterImage) {
    }
}
