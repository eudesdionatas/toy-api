package com.eudes.toyapi.util;

import lombok.Getter;

@Getter
public enum KnownVocabs {
    CC("cc", "http://creativecommons.org/ns#", "/vocabularies/cc.rdf"),
    DCAT("dcat", "http://www.w3.org/ns/dcat#", "/vocabularies/dcat.rdf"),
    DCE("dce", "http://purl.org/dc/elements/1.1/","/vocabularies/dcelements(Dublin Core).ttl"),
    DCTERMS("dcterms", "http://purl.org/dc/terms/","/vocabularies/dcterms(Dublin Core).ttl"),
    EVENT("event","http://purl.org/NET/c4dm/event.owl#", "/vocabularies/event.n3.ttl"),
    FOAF("foaf", "http://xmlns.com/foaf/0.1/","/vocabularies/foaf.rdf"),
    PROV("prov", "http://www.w3.org/ns/prov#", "/vocabularies/prov.ttl"),
    VCARD("vcard", "http://www.w3.org/2006/vcard/ns#", "/vocabularies/vcard.ttl"),
    SCHEMA("schema", "http://schema.org/" , "/vocabularies/schemaOrg.rdf"),
    SKOS("skos", "http://www.w3.org/2004/02/skos/core#", "/vocabularies/skos.rdf"),
    GEO("geo", "http://www.w3.org/2003/01/geo/wgs84_pos#", "/vocabularies/wgs84_pos.rdf");

    private final String prefix, uri, filePath;

    KnownVocabs(String prefix, String uri, String filePath) {
        this.prefix = prefix;
        this.uri = uri;
        this.filePath = filePath;
    }
}
