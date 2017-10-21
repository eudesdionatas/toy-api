package com.eudes.toyapi.api;

import com.eudes.toyapi.util.KnownVocabs;
import com.eudes.toyapi.util.OptGroupBuilder;
import org.apache.jena.query.DatasetAccessor;
import org.apache.jena.query.DatasetAccessorFactory;
import org.apache.jena.rdf.model.*;
import org.apache.jena.riot.RIOT;
import org.apache.jena.util.iterator.ExtendedIterator;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFSyntax;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.util.*;

import static org.springframework.util.StringUtils.hasText;

@RestController
@RequestMapping(value = "/saveResource")
public class MakeModelController {

    private final String fusekiURI = "http://localhost:3030/Teste";
    private final String graphURI = "/ontologias";
    private DatasetAccessor datasetAccessor = null;

    MakeModelController() {

        datasetAccessor = DatasetAccessorFactory.createHTTP(fusekiURI);

    }

    @PostMapping("/process")
    public ResponseEntity process(@RequestBody ResourceToy resource) {
        resource.setAbout(normalizeURI(resource.getAbout()));
        Model model = createModel(resource);
        addAsResource(model, resource);
        model.write(System.out);

        datasetAccessor.add(graphURI, model);
        return ResponseEntity.ok(null);
    }

    @GetMapping("/getVocabularyData")
    public ResponseEntity getVocabularyPredicates(@RequestParam(value = "vocabPrefix", required = false) String vocabPrefix,
                                                  @RequestParam(value = "search", required = false) String search){

        List<String> predicates = new ArrayList<>();
        if (!hasText(vocabPrefix) || !hasText(search))
            return ResponseEntity.ok(predicates);

        KnownVocabs knownVocab = KnownVocabs.valueOf(vocabPrefix.toUpperCase());

        OptGroupBuilder optGroupBuilder = new OptGroupBuilder();
        Map<String, OptGroup> optGroupMap = optGroupBuilder.build(knownVocab.getUri(), knownVocab.getFilePath(), search);

        return ResponseEntity.ok(optGroupMap.values());
    }

    private void addAsResource(Model model, ResourceToy resource) {
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

    private String getResourceID(ResourceToy resource) {
        return resource.getAbout() + UUID.randomUUID();
    }

    private Model createModel(ResourceToy resource) {
        Model model = ModelFactory.createDefaultModel();
        model.setNsPrefix(resource.getPrefix(), resource.getAbout());
        for (Vocabulary v : resource.getVocabularies()) {
            model.setNsPrefix(v.getPrefix(), normalizeURI(v.getUri()));
        }
        return model;
    }
}
