package com.eudes.toyapi.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResourceToy {

    private String about;
    private String prefix;
    private String name;
    List<Vocabulary> vocabularies = new ArrayList<>();

}
