package com.eudes.toyapi.util;


import com.eudes.toyapi.api.OptGroup;
import com.eudes.toyapi.api.Option;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.rdf.model.Statement;
import org.apache.jena.riot.RIOT;
import org.apache.jena.vocabulary.OWL;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class OptGroupBuilder {

    public Map<String, OptGroup> build(String vocabUri, String vocabFilePath, String search) {
        RIOT.init();
        InputStream vocabInputStream = getClass().getResourceAsStream(vocabFilePath);
        Model model = ModelFactory.createDefaultModel();
        String lang = vocabFilePath.endsWith("rdf") ? "RDF/XML" : "TURTLE";
        model.read(vocabInputStream, null, lang);

        Map<String, OptGroup> optGroupMap = new HashMap<>();

        model.listSubjects().forEachRemaining(res -> {
            Statement typeStmt = res.getProperty(RDF.type);
            if (typeStmt == null) return;

            Resource resource = typeStmt.getResource();
            String typeResourceUri = resource.getURI();
            System.out.println(typeResourceUri);
            if (!isPropertyResource(typeResourceUri)) return;

            String property = res.getURI().replace(vocabUri, "");
            if (search != null && !property.toLowerCase().contains(search.toLowerCase())) return;

            String domain = "Sem domínio específico";
            Statement domainStmt = res.getProperty(RDFS.domain);
            if (domainStmt != null) {
                Resource domainResource = domainStmt.getResource();
                if (domainResource != null) {
                    String domainUri = domainResource.getURI();
                    domain = domainUri != null ? domainUri.replace(vocabUri, "") : domain;
                }
            }

            if (domain.startsWith("http")) return;

            optGroupMap.putIfAbsent(domain, new OptGroup(domain, new ArrayList<>()));
            OptGroup optGroup = optGroupMap.get(domain);
            optGroup.getChildren().add(new Option(property, property));
        });

        return optGroupMap;
    }

    public Map<String, OptGroup> build(String vocabUri, String vocabFilePath) {
        return  build(vocabUri, vocabFilePath, null);
    }

    private boolean isPropertyResource(String uri) {
        return RDF.Property.getURI().equals(uri)
                || OWL.DatatypeProperty.getURI().equals(uri)
                || OWL.ObjectProperty.getURI().equals(uri);
    }
}