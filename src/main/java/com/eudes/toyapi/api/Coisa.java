package com.eudes.toyapi.api;


import java.io.InputStream;


import org.apache.jena.ontology.OntClass;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.rdf.model.*;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.riot.RIOT;
import org.apache.jena.vocabulary.OWL;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;

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


        InputStream in = Coisa.class.getResourceAsStream("/vocabularies/schemaOrg.rdf");
        RIOT.init();
        Model model = ModelFactory.createDefaultModel(); // creates an in-memory Jena Model
        model.read(in, null, "RDF/XML"); // parses an InputStream assuming RDF in Turtle format
        Property pPropertyName = ResourceFactory.createProperty("http://www.w3.org/2000/01/rdf-schema#", "domain");
//        ResIterator iter = model.listSubjectsWithProperty(pPropertyName);
//        ResIterator iter = model.listSubjects();
//
        StmtIterator iter = model.listStatements(
                new SimpleSelector(null, RDF.type, (RDFNode) null) {
//                    public boolean selects(Statement s)
//                    {return s.getString().endsWith("Property");}
                });

        while (iter.hasNext()) {
            Statement r = iter.nextStatement();//  nextResource();
            System.out.println(r);
        }


//        while ( datasets.hasNext() ) {
//            Resource dataset = datasets.next();
//            StmtIterator stmts  = dataset.listProperties();
//            System.out.println( "* "+dataset );
//            while ( stmts.hasNext() ) {
//                System.out.println( "** "+stmts.next() );
//            }
//        }

        // print out the predicate, subject and object of each statement
//        while (iter.hasNext()) {
//            Statement stmt      = iter.nextStatement(); // get next statement
//            Resource  subject   = stmt.getSubject();    // get the subject
//            Property predicate  = stmt.getPredicate();  // get the predicate
//            RDFNode   object    = stmt.getObject();     // get the object
//
//            String sujeito = subject.toString();
//            System.out.print(sujeito);
//            System.out.print(" " + predicate.toString() + " ");
//            System.out.print(object.asNode().getLiteralValue().toString());

//            String prop = null;
//            for(int i = (sujeito.length() - 1); sujeito.charAt(i) != '/' && sujeito.charAt(i) != '#'; i--)
//                prop = sujeito.substring(i, sujeito.length());
//            System.out.println(prop);
//            System.out.println("Quantidade de propriedades: " + prop.length());
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
//}
