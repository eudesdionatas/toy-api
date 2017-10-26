package com.eudes.semanticApi.api;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * Classe que é usada para definir a estrutura do vocabulário definido pelo cliente em formato JSON
 * @author Eudes Souza
 * @since 10/2017
 */
@Data
public class Vocabulary {

    /**
     * URI do vocabulário
     */
    private String uri;
    /**
     * Prefixo do vocabulário
     */
    private String prefix;
    /**
     * Lista de Pair - diferentes valores para (predicado, valor)
     */
    private List<Pair> pairs = new ArrayList<>();
}
