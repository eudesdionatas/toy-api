package com.eudes.toyapi.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Resource {

    private String about;
    List<Vocabulary> vocabularies = new ArrayList<>();

}
