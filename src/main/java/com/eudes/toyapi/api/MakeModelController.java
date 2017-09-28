package com.eudes.toyapi.api;

import org.apache.jena.query.DatasetAccessor;
import org.apache.jena.query.DatasetAccessorFactory;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.ResourceFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * Created by Eudes on 27/09/2017.
 */
@RestController
@RequestMapping(value = "/saveResource")
public class MakeModelController {

    private final String fusekiURI = "http://localhost:3030/";
    private final String graphURI = "/Teste";
    private DatasetAccessor datasetAccessor = null;

    MakeModelController(){
        datasetAccessor = DatasetAccessorFactory.createHTTP(fusekiURI);
    }

    @PostMapping("/process")
    public ResponseEntity process(@RequestBody Resource resource){
        Model model = createModel(resource);
        addAsResource(model, resource);
        datasetAccessor.add(graphURI, model);
        model.write(System.out);
        return ResponseEntity.ok(null);
    }

    private void addAsResource(Model model, Resource resource) {

        org.apache.jena.rdf.model.Resource r = ResourceFactory.createResource(resource.getAbout());
        r = model.createResource(getResourceURI(resource),r);
        for(Vocabulary v: resource.getVocabularies()){
            for(Pair p: v.getPairs()){
                String propertyName = p.getPropertyName();
                Property pPropertyName = ResourceFactory.createProperty(v.getUri(),p.getValue());
                r.addProperty(pPropertyName, p.getValue());
            }
        }

    }

    private String getResourceURI(Resource resource) {
        return resource.getAbout() + UUID.randomUUID();
    }

    private Model createModel(Resource resource) {
        Model model = ModelFactory.createDefaultModel();
        for (Vocabulary v: resource.getVocabularies()){
            model.setNsPrefix(v.getPrefix(), v.getUri());
        }
        return model;
    }
}
