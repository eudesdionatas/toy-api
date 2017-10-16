package com.eudes.toyapi.api;

import org.apache.jena.query.DatasetAccessor;
import org.apache.jena.query.DatasetAccessorFactory;
import org.apache.jena.rdf.model.*;
import org.apache.jena.riot.RIOT;
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
    Map<String, String> vocabs = new HashMap<String, String>();


    MakeModelController() {

        datasetAccessor = DatasetAccessorFactory.createHTTP(fusekiURI);

        vocabs.put("cc", "/vocabularies/cc.rdf");
        vocabs.put("dcat", "/vocabularies/dcat.rdf");
        vocabs.put("dce", "/vocabularies/dcelements(Dublin Core).ttl");
        vocabs.put("dcterms","/vocabularies/dcterms(Dublin Core).ttl");
        vocabs.put("event", "/vocabularies/event.n3.ttl");
        vocabs.put("foaf","/vocabularies/foaf.rdf");
        vocabs.put("prov", "/vocabularies/prov.ttl");
        vocabs.put("vcard", "/vocabularies/vcard.ttl");
        vocabs.put("schema", "/vocabularies/schemaOrg.rdf");
        vocabs.put("skos", "/vocabularies/skos.rdf");
        vocabs.put("geo", "/vocabularies/wgs84_pos.rdf");
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
    public ResponseEntity<List<String>> getVocabularyPredicates(@RequestParam(value = "vocabPrefix", required = false)  String vocabPrefix,
                                                                @RequestParam(value = "search", required = false)        String search){

        List<String> predicates = new ArrayList<>();
        String vocabPath = vocabs.get(vocabPrefix);
        if (!hasText(vocabPrefix) || !hasText(search))
            return ResponseEntity.ok(predicates);
        InputStream in = Coisa.class.getResourceAsStream(vocabPath);
        RIOT.init();
        Model model = ModelFactory.createDefaultModel();
        String formatModel = null;
        if (vocabPath.contains(".rdf"))
            formatModel = "RDF/XML";
        else if (vocabPath.contains(".ttl"))
            formatModel = "TURTLE";
        model.read(in, null, formatModel);
        Property pPropertyName = ResourceFactory.createProperty("http://www.w3.org/2000/01/rdf-schema#", "label");
        Selector selector = new SimpleSelector(null, pPropertyName, (RDFNode) null);
        StmtIterator iter = model.listStatements(selector);
        while (iter.hasNext()) {
            Statement stmt = iter.nextStatement();  //get next statement
            Resource subject = stmt.getSubject();   //get the subject
            String sujeito = subject.toString();
            String prop = null;
            for(int i = (sujeito.length() - 1); sujeito.charAt(i) != '/' && sujeito.charAt(i) != '#'; i--)
                prop = sujeito.substring(i, sujeito.length());
                predicates.add(prop);
        }
        List<String> subSetPredicates = new ArrayList<>();
        for (String predicate: predicates){
            if (predicate != null)
                if(predicate.contains(search))
                    subSetPredicates.add(predicate);
        }
        return ResponseEntity.ok(subSetPredicates);
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
