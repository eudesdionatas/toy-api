package com.eudes.toyapi;


import com.eudes.toyapi.api.OptGroup;
import com.eudes.toyapi.util.OptGroupBuilder;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.DCTerms;
import org.junit.Ignore;
import org.junit.Test;

import java.util.Map;

public class ReadRDFTest {

    private OptGroupBuilder optGroupBuilder = new OptGroupBuilder();

    @Test
    @Ignore
    public void listPropertiesSchemaOrg() {
        String vocabUri = "http://schema.org/";
        String vocabFilePath = "/vocabularies/schemaOrg.rdf";
        Map<String, OptGroup> optGroupMap = optGroupBuilder.build(vocabUri, vocabFilePath);

        optGroupMap.values().forEach(System.out::println);
    }

    @Test
    public void listPropertiesFoaf() {
        String vocabUri = FOAF.getURI();
        String vocabFilePath = "/vocabularies/foaf.rdf";
        Map<String, OptGroup> optGroupMap = optGroupBuilder.build(vocabUri, vocabFilePath);

        optGroupMap.values().forEach(System.out::println);
    }

    @Test @Ignore
    public void listPropertiesDcTerms() {
        String vocabUri = DCTerms.getURI();
        String vocabFilePath = "/vocabularies/dcterms(Dublin Core).ttl";
        Map<String, OptGroup> optGroupMap = optGroupBuilder.build(vocabUri, vocabFilePath);

        optGroupMap.values().forEach(System.out::println);
    }
}
