package com.eudes.semanticApi.api;

import com.eudes.semanticApi.util.KnownVocabs;
import com.eudes.semanticApi.util.OptGroupBuilder;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.jena.query.DatasetAccessor;
import org.apache.jena.query.DatasetAccessorFactory;
import org.apache.jena.rdf.model.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import static org.springframework.util.StringUtils.hasText;

/***
 * Controlador REST responsável por tratar requisições e respostas para o cliente
 * @author Eudes Souza
 * @since 10-2017
 * */
@RestController
@RequestMapping(value = "/saveResource")
@Api(value="onlinestore", description="Controlador REST responsável por tratar requisições e respostas para o cliente")
public class MakeModelController {

    /**
     *String que guarda a URL do servidor Fuseki/nomeDoBanco para armazenar as ontologias
     */
    private final String fusekiURI = "http://localhost:3030/Teste";
    /**
     *String que armazena o nome do grafo para o banco
     */
    private final String graphURI = "/ontologias";
    /**
     *DatasetAccessor para manter a URL do servidor Fuseki e o grafo do banco
     */
    private DatasetAccessor datasetAccessor = null;

    /**
     * Inicia MakeModelController com a URL do servidor Fuseki onde serão armazenadas as ontologias
     */
    MakeModelController() {
        datasetAccessor = DatasetAccessorFactory.createHTTP(fusekiURI);
    }

    /**
     * Método responsável por receber e salvar o recurso passado na ontologia definida pelo cliente
     * <br>O recurso é passado em formato JSON
     * @param resource Recurso passado pelo cliente
     * @return Retorna um código código HTTP 200 se a operação for realizada com sucesso
     */
    @PostMapping("/process")
    @ApiOperation(value = "Método responsável por receber e salvar o recurso passado na ontologia definida pelo cliente", response = ResponseEntity.class)
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Salva o recurso com sucesso"),
            @ApiResponse(code = 401, message = "You are not authorized to view the resource"),
            @ApiResponse(code = 403, message = "Accessing the resource you were trying to reach is forbidden"),
            @ApiResponse(code = 404, message = "The resource you were trying to reach is not found")})
    public ResponseEntity process(@RequestBody ResourceApi resource) {
        resource.setAbout(normalizeURI(resource.getAbout()));
        Model model = createModel(resource);
        addAsResource(model, resource);
        model.write(System.out);

        datasetAccessor.add(graphURI, model);
        return ResponseEntity.ok(null);
    }

    /**
     * Método responsável por recuperar os predicados do vocabulário de interesse de acordo com o termo passado
     * @param vocabPrefix String com o prefixo do vocabulário no qual serão feitas as pesquisas
     * @param search String com o termo de busca para encontrar propriedades com similaridade ao termo passado
     * @return Retorna um status HTTP 'ok' com uma lista de OptGroup. Cada um destes contém predicados específicos daquele grupo definidos no vocabulário. Um exemplo é Schema.org que possui Product, Place, Person, Organization, Review, Action...
     */
    @GetMapping("/getVocabularyData")
    @ApiOperation(value = "Método responsável por recuperar os predicados do vocabulário de interesse de acordo com o termo passado", response = OptGroup.class, responseContainer = "Set")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "Retorna a lista de predicados com sucesso"),
            @ApiResponse(code = 401, message = "You are not authorized to view the resource"),
            @ApiResponse(code = 403, message = "Accessing the resource you were trying to reach is forbidden"),
            @ApiResponse(code = 404, message = "The resource you were trying to reach is not found")})
    public ResponseEntity<Collection<OptGroup>> getVocabularyPredicates(@RequestParam(value = "vocabPrefix", required = false) String vocabPrefix,
                                                  @RequestParam(value = "search", required = false) String search){

        List<OptGroup> predicates = new ArrayList<>();
        if (!hasText(vocabPrefix) || !hasText(search))
            return ResponseEntity.ok(predicates);

        KnownVocabs knownVocab = KnownVocabs.valueOf(vocabPrefix.toUpperCase());

        OptGroupBuilder optGroupBuilder = new OptGroupBuilder();
        Map<String, OptGroup> optGroupMap = optGroupBuilder.build(knownVocab.getUri(), knownVocab.getFilePath(), search);

        return ResponseEntity.ok(optGroupMap.values());
    }

    /**
     * Método responsavel por criar um novo recurso de acordo com os dados passados de acordo com a ontologia predefinida
     * <br>Serão passados os vocabulários, propridades e valores para criar a nova instância da ontologia
     * @param model Modelo que receberá os dados da nova ontologia a ser criada
     * @param resource Um ResourceApi com dados da nova ontologia
     */
    private void addAsResource(Model model, ResourceApi resource) {
        Resource resourceDefiniton = ResourceFactory
                .createResource(resource.getAbout() +  resource.getName());
        Resource resourceInstance = model.createResource(getResourceID(resource), resourceDefiniton);
        for (Vocabulary v : resource.getVocabularies()) {
            for (Pair p : v.getPairs()) {
                String propertyName = p.getPropertyName();
                Property pPropertyName = ResourceFactory.createProperty(normalizeURI(v.getUri()), propertyName);
                resourceInstance.addProperty(pPropertyName, p.getValue());
            }
        }
    }

    /**
     * Método responsável por normalizar a URI do recurso criado, adicionando '/' caso necessário
     * @param uri String que armazena a URI
     * @return Retorna uma String de uma URI normalizada
     */
    private String normalizeURI(String uri) {
        return (uri.endsWith("/") || uri.endsWith("#")) ? uri : uri + "/";
    }

    /**
     * Método que gera um identidicador único para ser acoplado à URI para uma nova instância da ontologia
     * @param resource ResourceApi passado para tratar a URI do recurso
     * @return Retorna uma String com a URI do recurso mais um identificador único
     */
    private String getResourceID(ResourceApi resource) {
        return resource.getAbout() + UUID.randomUUID();
    }

    /**
     * Método responsável por criar um modelo que receberá os dados passados:
     * <br>Vocabulários com os respectivos prefixos e propriedades com os respectivos valores
     * @param resource ResourceApi com os dados a serem inseridos no modelo
     * @return Retorna um Model com os dados passados
     */
    private Model createModel(ResourceApi resource) {
        Model model = ModelFactory.createDefaultModel();
        model.setNsPrefix(resource.getPrefix(), resource.getAbout());
        for (Vocabulary v : resource.getVocabularies()) {
            model.setNsPrefix(v.getPrefix(), normalizeURI(v.getUri()));
        }
        return model;
    }
}
