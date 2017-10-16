package com.eudes.toyapi.api;


import java.io.InputStream;


import org.apache.jena.rdf.model.*;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.riot.RIOT;

/**
 * Created by Eudes on 10/10/2017.
 */
public class Coisa {

    public static void main(String[] args) {
//        InputStream in = Coisa.class.getResourceAsStream("/vocabularies/schemaOrg(original).ttl");

//        RIOT.init() ;
//
//        Model model = ModelFactory.createDefaultModel(); // creates an in-memory Jena Model
//        model.read(in, null, "TURTLE"); // parses an InputStream assuming RDF in Turtle format

//         Write the Jena Model in Turtle, RDF/XML and N-Triples format
//        System.out.println("\n---- Turtle ----");
//        model.write(System.out, "TURTLE");
//        System.out.println("\n---- RDF/XML ----");
//        model.write(System.out, "RDF/XML");
//        System.out.println("\n---- RDF/XML Abbreviated ----");
//        model.write(System.out, "RDF/XML-ABBREV");
//        System.out.println("\n---- N-Triples ----");
//        model.write(System.out, "N-TRIPLES");
//        System.out.println("\n---- RDF/JSON ----");
//        model.write(System.out, "RDF/JSON");


        InputStream in = Coisa.class.getResourceAsStream("/vocabularies/wgs84_pos.rdf");
        RIOT.init();
        Model model = ModelFactory.createDefaultModel(); // creates an in-memory Jena Model
        //model.read(in, RDFS.getURI());
        model.read(in, null, "RDF/XML"); // parses an InputStream assuming RDF in Turtle format
//        System.out.println("\n---- RDF/XML ----");
        Resource pessoa = ResourceFactory.createResource("http://schema.org/Person");
        Property pPropertyName = ResourceFactory.createProperty("http://www.w3.org/2000/01/rdf-schema#", "label");

        // list the statements in the Model

        StmtIterator iter =  model.listStatements(new SimpleSelector(null, pPropertyName, (RDFNode) null));

        // print out the predicate, subject and object of each statement
        while (iter.hasNext()) {
            Statement stmt      = iter.nextStatement(); // get next statement
            Resource  subject   = stmt.getSubject();    // get the subject
            Property predicate  = stmt.getPredicate();  // get the predicate
            RDFNode   object    = stmt.getObject();     // get the object

            String sujeito = subject.toString();
            System.out.print(sujeito);
            System.out.print(" " + predicate.toString() + " ");
            System.out.print(object.asNode().getLiteralValue().toString());
            String prop = null;
            for(int i = (sujeito.length() - 1); sujeito.charAt(i) != '/' && sujeito.charAt(i) != '#'; i--)
                prop = sujeito.substring(i, sujeito.length());
            System.out.println("\t\t\t\t--------     " + prop);
//            if (object instanceof org.apache.jena.rdf.model.Resource) {
//                System.out.println(object.toString());
//            } else {
//                // object is a literal
//                System.out.println(" \"" + object.toString() + "\"");
//            }
//
//            System.out.println(" .");
        }
        //model.write(System.out, "RDF/XML");

    }
}
