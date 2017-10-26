package com.eudes.semanticApi.api;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Classe que mantem um grupo de predicados de um vocabulário
 * @autor Eudes Souza
 * @since 10/2017
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OptGroup {
    /**
     * String que mantem o título do grupo de predicados
     */
    @ApiModelProperty(notes = "Título do grupo criado")
    private String text;
    /**
     * Lista de Option onde cada option possui um predicado
     */
    @ApiModelProperty(notes = "Lista de predicados do grupo")
    private List<Option> children;
}
