class SemanticAPI{
    baseURL     = 'http://localhost:3030/Teste'
    graph       = 'ontologiasblog'
    resource    = {}
    constructor(baseURL, graph, resource){
        this.baseURL    = baseURL
        this.graph      = graph
        this.resource   = resource
    }
    setBaseURL(baseURL){
        this.baseURL = baseURL 
    }
    setGraph (graph){
        this.graph = graph
    }
    setResource(resource){
        this.resource = resource
    }
    saveResource(resource){
        fetch('http://localhost:8080/resource/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=utf-8'},
            body: JSON.stringify(resource.getResourceToSend())
        }).then(function(response) {
            //Verifica se o status da mensagem inicia com 2. Podendo ser 2xx, onde x pode ser qualquer número
            if(response.ok)
              divForm.innerHTML += `<br/><br/><h3>Recurso salvo com sucesso</h3>`
            else
              divForm.innerHTML += `<br/><br/><h3>Erro ao tentar gravar ontologia</h3><br/>${status}
              <br/>${status.message}</br>${status.toString}`
          //Este bloco trata o evento da conexão estar indisponível
          }).catch(function(error) {
              divForm.innerHTML += `<br/><br/><h3>Problema de conexão ao tentar salvar a ontologia<h3><br/>
              <br/>${error.message}`
          });
    }
}
