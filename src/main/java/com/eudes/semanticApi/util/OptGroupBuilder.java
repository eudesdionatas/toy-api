package com.eudes.semanticApi.util;


import com.eudes.semanticApi.api.OptGroup;
import com.eudes.semanticApi.api.Option;
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

/**
 * Classe responsável por ler os dados do vocabulário
 * @author Eudes Souza
 * @since 10/2017
 */
public class OptGroupBuilder {

    /**
     * Método responsável por construir um Map contendo OptGroup's onde cada OptGroup mantém o título (text) do grupo de
     * propriedades e uma lista de propriedades (children)
     * @param vocabUri String com a URI do vocaulário
     * @param vocabFilePath String com o caminho do vocabulário a ser lido
     * @param search String com o termo de busca
     * @return Map de OptGroup's de propriedades do vocabulário
     */
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
//            System.out.println(typeResourceUri);
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

    /**
     * Método responsável por construir a lista de propriedades sem considerar algum termo de busca
     * @param vocabUri String contendo a URI do vocabulário a ser lido
     * @param vocabFilePath String contendo o caminho do vocabulário a ser lido
     * @return Map de OptGroup's de propriedades do vocabulário
     */
    public Map<String, OptGroup> build(String vocabUri, String vocabFilePath) {
        return  build(vocabUri, vocabFilePath, null);
    }

    /**
     * Método responsável por analisar se o dado (recurso) lido no vocabulário é uma propriedade
     * @param uri String contendo a URI do recurso do vocabulário a ser a analisada
     * @return Retorna um booleano com o valor true quando a URI for igual a uma das constantes RDF.Property, OWL.DatatypeProperty
     * ou OWL.ObjectProperty. É retornado falso caso contrário
     */
    private boolean isPropertyResource(String uri) {
        return RDF.Property.getURI().equals(uri)
                || OWL.DatatypeProperty.getURI().equals(uri)
                || OWL.ObjectProperty.getURI().equals(uri);
    }
}
