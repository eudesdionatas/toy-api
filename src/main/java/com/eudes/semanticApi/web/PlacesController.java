package com.eudes.semanticApi.web;

import org.apache.jena.query.DatasetAccessor;
import org.apache.jena.query.DatasetAccessorFactory;
import org.apache.jena.rdf.model.*;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping(value = "/places")
public class PlacesController {

    private final String fusekiURI = "http://localhost:3030/SemanticFx";
    private final String graphURI = "/places";
    private final String Schema_URI = "http://schema.org/";
    private final String REV_URI = "http://purl.org/stuff/rev#";
    private final String GEO_URI = "http://www.w3.org/2003/01/geo/wgs84_pos#";
    private final DatasetAccessor datasetAccessor;

    public PlacesController() {
        datasetAccessor = DatasetAccessorFactory.createHTTP(fusekiURI);
    }

    @PostMapping //Atalho para @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Place> save(@RequestBody Place place) {
        Model model = createModel();
        addAsResource(model, place);
        this.datasetAccessor.add(graphURI, model);
        model.write(System.out);
        return ResponseEntity.ok(place);
    }

    @GetMapping
    public ResponseEntity<List<Place>> listAll() {
        List<Place> places = new ArrayList<>();
        Model model = this.datasetAccessor.getModel(graphURI);
        model.write(System.out);
        if (model != null && !model.isEmpty()) {
            ResIterator it = model.listSubjects();
            it.forEachRemaining(resource2 -> {
                places.add(fromResource(resource2));
            });
        }
        model.write(System.out);
        return ResponseEntity.ok(places);
    }

    private Place fromResource(Resource resource) {
        Place place = new Place();

        final Property name = ResourceFactory.createProperty(Schema_URI, "name");
        final Property longitude = ResourceFactory.createProperty(GEO_URI, "long");
        final Property latitude = ResourceFactory.createProperty(GEO_URI, "lat");
        final Property comment = ResourceFactory.createProperty(REV_URI, "comment");
        final Property rate = ResourceFactory.createProperty(REV_URI, "rating");

        place.setComment(resource.getProperty(comment).getString());
        place.setLatitude(resource.getProperty(latitude).getFloat());
        place.setLongitude(resource.getProperty(longitude).getFloat());
        place.setPlaceName(resource.getProperty(name).getString());
        place.setRate(resource.getProperty(rate).getFloat());

        return place;
    }

    public void addAsResource(Model model, Place place){
        String comment = StringUtils.hasText(place.getComment())? place.getComment() : "";
        String placeName = StringUtils.hasText(place.getPlaceName())? place.getPlaceName() : "";
        String rate = String.valueOf(place.getRate());
        String latitude = String.valueOf(place.getLatitude());
        String longitude = String.valueOf(place.getLongitude());

        Resource placeResource = ResourceFactory.createResource(Schema_URI + "Place");

        Property nameProp = ResourceFactory.createProperty(Schema_URI, "name");
        Property longitudeProp = ResourceFactory.createProperty(GEO_URI, "long");
        Property latitudeProp = ResourceFactory.createProperty(GEO_URI, "lat");
        Property commentProp = ResourceFactory.createProperty(REV_URI, "comment");
        Property ratingProp = ResourceFactory.createProperty(REV_URI, "rating");

        model.createResource(getResourceURI(),placeResource)
                .addProperty(nameProp, placeName)
                .addProperty(commentProp,comment)
                .addProperty(ratingProp, rate)
                .addProperty(latitudeProp, latitude)
                .addProperty(longitudeProp, longitude);
    }

    private String getResourceURI(){
        return Schema_URI + "Place/" + UUID.randomUUID();
    }

    private Model createModel() {
        Model model = ModelFactory.createDefaultModel();
        model.setNsPrefix("schema", Schema_URI);
        model.setNsPrefix("rev", GEO_URI);
        model.setNsPrefix("geo", REV_URI);
        return model;
    }
//
//
}