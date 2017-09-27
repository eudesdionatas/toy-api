package com.eudes.toyapi.api;

import org.apache.jena.query.DatasetAccessor;
import org.apache.jena.query.DatasetAccessorFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Eudes on 27/09/2017.
 */
@RestController
@RequestMapping(value = "/saveResource")
public class MakeModelController {

    private final String fusekiURI = "http://localhost:3030/Teste";
    private Map<String, String> vocabs = new HashMap<String, String>();
    private Map<String, String> props = new HashMap<String, String>();
    private DatasetAccessor datasetAccessor = null;

    MakeModelController(){
        datasetAccessor = DatasetAccessorFactory.createHTTP(fusekiURI);
    }

    @PostMapping("/process")
    public ResponseEntity process(@RequestBody Resource resource){
        System.out.println(resource);
        return ResponseEntity.ok(null);
    }
}
