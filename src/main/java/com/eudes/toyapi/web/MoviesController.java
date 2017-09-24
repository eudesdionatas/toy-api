package com.eudes.toyapi.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/movies")
public class MoviesController {

    private List<Movie> movies = new ArrayList<>();
    private int idGen = 0;

    public MoviesController() {
        movies.add(new Movie(++idGen, "Deadpool", "Action", 2016));
        movies.add(new Movie(++idGen, "Forest Gump", "Comedy", 1990));
    }

    @PostMapping
    public ResponseEntity<Movie> save(@RequestBody Movie movie) {
        // response entity é uma resposta http. vai ter um status (200 - OK, por ex.) e um corpo (opcional)
        movie.setId(++idGen);
        movies.add(movie);

        return ResponseEntity.ok(movie);
    }

    @GetMapping
    public ResponseEntity<List<Movie>> list() {
        return ResponseEntity.ok(movies);
    }
}
