package com.eudes.semanticApi.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Movie {

    private long id;
    private String title;
    private String genre;
    private int year;
}
