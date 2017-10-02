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
        resource.setAbout(normalizeURI(resource.getAbout()));
        Model model = createModel(resource);
        addAsResource(model, resource);
        model.write(System.out);
        datasetAccessor.add(graphURI, model);
        return ResponseEntity.ok(null);
    }

    private void addAsResource(Model model, Resource resource) {
        org.apache.jena.rdf.model.Resource resourceDefiniton = ResourceFactory
                .createResource(resource.getAbout() +  resource.getName());
        org.apache.jena.rdf.model.Resource resourceInstance = model.createResource(getResourceID(resource), resourceDefiniton);
        for (Vocabulary v : resource.getVocabularies()) {
            for (Pair p : v.getPairs()) {
                String propertyName = p.getPropertyName();
                Property pPropertyName = ResourceFactory.createProperty(normalizeURI(v.getUri()), propertyName);
                resourceInstance.addProperty(pPropertyName, p.getValue());
            }
        }

    }

    private String normalizeURI(String uri) {
        return (uri.endsWith("/") || uri.endsWith("#")) ? uri : uri + "/";
    }

    private String getResourceID(Resource resource) {
        return resource.getAbout() + UUID.randomUUID();
    }

    private Model createModel(Resource resource) {
        Model model = ModelFactory.createDefaultModel();
        model.setNsPrefix(resource.getPrefix(), resource.getAbout());
        for (Vocabulary v : resource.getVocabularies()) {
            model.setNsPrefix(v.getPrefix(), normalizeURI(v.getUri()));
        }
        return model;
    }
}
