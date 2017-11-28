class SemanticFxApi{
  /**
  * @param {Object} config Contém as configurações necessárias para o funcionamento da api e que
  * serão reutilizadas nos métodos internos. nesse exemplo só tem uma configuração obrigatória (baseURL)
  * @return {SemanticFxApi} Uma nova instancia da api
  */
  constructor(config){
    if (!config || !config.baseURL) {
      throw Error('baseURL nao foi informada')
    }
    this.config = config
    // parametros comuns de todas as requisições
    // poderia ser passado no config tb
    this.defaultParams = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
  /**
  * Abstrai o fetch global, concatenando a baseURL às URLs de endpoint
  * @param {String} endpoint URL parcial do endpoint q será invocado
  * @param {Object} params Configurações da requisição (headers, data, method, etc)
  * @return {Promise} Promise da requisição
  */
  call(endpoint, params){
    if (endpoint.startsWith('/')) {
      endpoint = endpoint.substring(1)
    }
    return fetch(`${this.baseURL}/${endpoint}`, Object.assing({}, this.defaultParams, params))
      .then(response => response.json())
  }
  /**
  * Reutiliza o fetch inteno para fazer uma requisição POST
  * @param {String} endpoint URL parcial do endpoint q será invocado
  * @param {Object} body Objeto q será serializado e enviado como corpo da requisição
  * @return {Promise} Promise da requisição
  */
  post(endpoint, body){
    return this.call(endpoint, { 
      method: 'POST',
      data: JSON.stringify(body)
    })
  }
  /**
  * Realiza uma requisção POST para salvar um resource
  * @param {Object} resource Objeto representando um resource q será enviado como corpo da requisição
  * @return {Promise} Promise da requisição
  */
  saveResource(resource){
    return this.post('/resource/save', resource)
  }
  /**
  * Realiza uma requisição GET para obter um resource por id
  * @param {Number | String} resourceId Id do resource
  * @returns {Promise} Promise da requisição
  */
  getResource(resourceId){
    return this.call(`/resources/${resourceId}`)
  }
}


// ex. de utilização
const config = { 
  baseURL: 'http://localhost:8080/' 
}

const api = new SemanticFxApi(config)

// resource pode ser uma instancia de uma classe Resource ou um objeto literal
const resource = { /* propriedades do resource */ }

api.saveResource(resource)
  .then(response => { /* tratamento de sucesso */ })
  .catch(error => { /* tratamento de erro */ })

api.getResource(123)
  .then(response => { /* tratamento de sucesso */ })
  .catch(error => { /* tratamento de erro */ })

// observe q vc não precisa informar os endpoints (estão abstraídos pelo client), 
// somente a base url é necessária


// se vc não se importar em ter dependência de uma lib, pode usar o axios
// https://github.com/axios/axios
// vai facilitar sua vida

const axios = Axios // adicionei a dependencia aqui. olhe as settings da aba JS

const apiAxios = axios.create(config)

apiAxios.post('/resources/save', { params: resource })
  .then(response => { /* tratamento de sucesso */ })
  .catch(error => { /* tratamento de erro */ })

apiAxios.get('/resources/123')
  .then(response => { /* tratamento de sucesso */ })
  .catch(error => { /* tratamento de erro */ })

// vc pode ainda usar o axios internamente na sua classe SemanticFxApi substituindo o fetch,
// que tem um modo de utilizar mais complicado e passível a erros (na minha opinião).
// com o axios vc não precisa serializar o objeto explicitamente com JSON.stringify e nem
// invocar response.json() qdo a promise for resolvida. além disso existem os métodos
// utilitários pra cada method http (.get, .post, .put, etc...), não havendo a necessidade
// de setar o method explicitamente nas configs da requisição. e por aí vai... dá pra ter uma ideia
 
/**
 * Exemplo de uso no wordpress
 */


var btnSubmit = document.getElementById('buttonFormSubmit')
btnSubmit.onclick = function(event){
   event.preventDefault();
   const config = { 
     baseURL: 'http://localhost:8080/'
   }
   const api = new SemanticAPI(config)
   const resource = new Resource('contactData', 'contact', 'http://contactmail.com#Person')
   resource.addVocabulary('schema', 'http://schema.org/')
   const emailValue = document.getElementById('inputEmail').value
   resource.addTriple('schema', 'email', emailValue)
   const nameValue = document.getElementById('inputName').value
   resource.addTriple('schema', 'name', nameValue)
   const subjectValue = document.getElementById('inputSubject').value
   resource.addTriple('schema', 'about', subjectValue)
   const telValue = document.getElementById('inputTel').value
   resource.addTriple('schema', 'telephone', telValue )
   const messageValue = document.getElementById('inputMessage').value
   resource.addTriple('schema', 'text', messageValue)
   const resourceToSend = resource.getResourceToSend()
   api.saveResource(resourceToSend)
     .then(json =>           
            alert(`Recurso salvo com sucesso\nSeu workspace é: ${json.workspace}\nO ID do recurso é: ${json.resourceID}`))
     .catch(error => 
        alert(`Problema de conexão ao tentar salvar a ontologia\n${error.message}`))
 }
