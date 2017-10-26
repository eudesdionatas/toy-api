package com.eudes.semanticApi.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Classe que é usada para definir a estrutura do recurso definido pelo cliente em formato JSON
 * @author Eudes Souza
 * @since 10/2017
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResourceApi {

    /**
     * URI do recurso criado
     */
    private String about;
    /**
     * Prefixo do recurso criado
     */
    private String prefix;
    /**
     * Nome do recurso criado
     */
    private String name;
    /**
     * Lista dos vocabulários usados no recurso criado
     */
    List<Vocabulary> vocabularies = new ArrayList<>();

}
