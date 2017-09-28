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

@RestController
@RequestMapping(value = "/saveResource")
public class MakeModelController {

    private final String fusekiURI = "http://localhost:3030/Teste";
    private final String graphURI = "/coisinhas";
    private DatasetAccessor datasetAccessor = null;

    MakeModelController() {
        datasetAccessor = DatasetAccessorFactory.createHTTP(fusekiURI);
    }

    @PostMapping("/process")
    public ResponseEntity process(@RequestBody Resource resource) {
        Model model = createModel(resource);
        addAsResource(model, resource);
        datasetAccessor.add(graphURI, model);
        model.write(System.out);
        return ResponseEntity.ok(null);
    }

    private void addAsResource(Model model, Resource resource) {
        String about = resource.getAbout();
        if (!about.endsWith("/")) about += "/";

        org.apache.jena.rdf.model.Resource resourceDefiniton = ResourceFactory.createResource(about +  resource.getName());
        org.apache.jena.rdf.model.Resource resourceInstance = model.createResource(getResourceURI(resource), resourceDefiniton);
        for (Vocabulary v : resource.getVocabularies()) {
            for (Pair p : v.getPairs()) {
                String propertyName = p.getPropertyName();
                Property pPropertyName = ResourceFactory.createProperty(v.getUri(), propertyName);
                resourceInstance.addProperty(pPropertyName, p.getValue());
            }
        }

    }

    private String getResourceURI(Resource resource) {
        return resource.getAbout() + UUID.randomUUID();
    }

    private Model createModel(Resource resource) {
        Model model = ModelFactory.createDefaultModel();
        model.setNsPrefix(resource.getPrefix(), resource.getAbout());
        for (Vocabulary v : resource.getVocabularies()) {
            model.setNsPrefix(v.getPrefix(), v.getUri());
        }
        return model;
    }
}
