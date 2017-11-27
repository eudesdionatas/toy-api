package com.eudes.semanticApi.api;

import org.apache.jena.base.Sys;
import org.apache.jena.query.DatasetAccessor;
import org.apache.jena.query.DatasetAccessorFactory;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Resource;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Eudes on 13/11/2017.
 */
public class ShowGraph {

    public static void main(String args[]) {

        List<Pair> pairs = new ArrayList<>();
        pairs.add(new Pair("name",      "Eudes Dionatas Silva Souza", false,    ""));
        pairs.add(new Pair("site",      "http://site.com",            true,     "FN"));
        pairs.add(new Pair("knows",     "http://eudesdionatas.com",   true,     ""));
        pairs.add(new Pair("FN",        "",                           true,     ""));
        pairs.add(new Pair("FamilyName","Souza",                      false,     "FN"));
        pairs.add(new Pair("GivenName", "Eudes",                      false,     "FN"));
        pairs.add(new Pair("age",       "32",                         false,    ""));
        pairs.add(new Pair("genre",     "Male",                       false,    ""));
        List<Vocabulary> vocabularies = new ArrayList<>();
//        vocabularies.add(new Vocabulary("http://xmlns.com/foaf/0.1/", "foaf", pairs));
        vocabularies.add(new Vocabulary("http://www.w3.org/2001/vcard-rdf/3.0#", "vcard",pairs));
        ResourceApi resourceApi = new ResourceApi("http://pessoa.com/", "pes", "pessoa", vocabularies);

        MakeModelController mmc = new MakeModelController();
        Model model = mmc.createModel(resourceApi);
        mmc.addAsResource(model, resourceApi);
        model.write(System.out);
    }

}
