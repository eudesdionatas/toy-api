package com.eudes.toyapi.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Created by Eudes on 16/10/2017.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OptGroup {
    String text;
    List<Option> children;
}
