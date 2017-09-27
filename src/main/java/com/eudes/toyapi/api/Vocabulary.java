package com.eudes.toyapi.api;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Vocabulary {

    private String uri;
    private String prefix;
    private List<Property> properties = new ArrayList<>();
}
