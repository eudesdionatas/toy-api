package com.eudes.semanticApi.web;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created by Eudes on 22/09/2017.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Place {

    private long id;
    private String placeName;
    private String comment;
    private float rate;
    private float latitude;
    private float longitude;

}
