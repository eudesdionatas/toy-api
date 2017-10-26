package com.eudes.semanticApi.api;

import lombok.Data;

/**
 * Classe que é usada para definir a estrutura do par (predicado, valor) definido pelo cliente em formato JSON
 * @author Eudes Souza
 * @since 10/2017
 */
@Data
public class Pair {

    /**
     * Nome do predicado
     */
    private String propertyName;
    /**
     * Valor do predicado
     */
    private String value;


}
