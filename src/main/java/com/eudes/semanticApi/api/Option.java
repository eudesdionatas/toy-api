package com.eudes.semanticApi.api;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Classe que mantem o id e o valor da opção
 * <br>Esta classe possui a estrutura correta para ser usada para criar a opção que pode ser aplicada em um select HTML
 * <br>A estrutura desta classe é usada para montar o código JSON interpretável pelo select
 * @author Eudes Souza
 * @since 10/2017
 */
@Data
@AllArgsConstructor
public class Option {
    /**
     * String que mantem o id da opção
     */
    @ApiModelProperty(notes = "Identificador do predicado")
    private String id;
    /**
     * String que mantem o texto da opção
     */
    @ApiModelProperty(notes = "Texto da opção")
    private String text;
}
