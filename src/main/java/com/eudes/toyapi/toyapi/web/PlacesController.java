package com.eudes.toyapi.toyapi.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Eudes on 22/09/2017.
 */



@RestController
@RequestMapping(value = "/places")
public class PlacesController {

    private List<Place> places = new ArrayList<>();
    private int idGen = 0;

    public PlacesController() {
        places.add(new Place(++idGen, "Elevador Lacerda", "Famoso", 5.4f, 4.7f, 9.2f));
        places.add(new Place(++idGen, "Praia do Flamengo", "Distante", 1.3f,2.4f,3.7f));
    }


    @PostMapping //Atalho para @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Place> save(@RequestBody Place place) {
        // response entity é uma resposta http. vai ter um status (200 - OK, por ex.) e um corpo (opcional)
        place.setId(++idGen);
        places.add(place);

        return ResponseEntity.ok(place);
    }

    @GetMapping
    public ResponseEntity<List<Place>> list() {
        return ResponseEntity.ok(places);
    }
}