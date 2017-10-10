(
    function() {

      //Pega o primeiro formulário da página e atrabui a uma variável 'resForm'
      const resForm = document.forms[0]

      //Pega os botões da página e atrabui a uma variável
      const addVocabButton = document.getElementById('addVocab')
      const addPropButton = document.getElementById('addProp')
      const saveButton = document.getElementById('save')

      //Pega a tag <pre> de id result e atrabui a uma variável 'result'
      const result = document.getElementById('result')

      //Pega os campos de inserir os dados do recuro e atribui e atribui a variáveis
      const resPrefixField = document.getElementById('resPrefix')
      const resNameField = document.getElementById('resName')
      const resAboutField = document.getElementById('resAbout')

      //Pega os campos de inserir os dados do vocabulário e atribui e atribui a variáveis
      const vocabURIField = document.getElementById('vocabUri')
      const vocabularieField = document.getElementById('vocabularie')

      //Pega os campos de inserir os dados da propriedades e atribui e atribui a variáveis
      const propPrefixField = document.getElementById('propPrefix')
      const propNameField = document.getElementById('propName')
      const propValueField = document.getElementById('propValue')


      //Cria objeto resource com um objeto vocabularies dentro
      const resource = {
        vocabularies: {}
      }

      //Muda o comportamento padrão da tooltip que é ser mostrada apenas quando se passa o mouse por cima do elemento
      $('[data-toggle="tooltip"]').tooltip({ trigger: 'manual' })

      //Insere ou remove a classe de erro do css do bootstrap
      function toggleValid(elem, valid) {
        valid ? elem.classList.remove('has-error') : elem.classList.add('has-error')
      }

      //Verifica se a função é válida
      //Esta função está validando URLs e não URIs
      function isValidURL(uri){
        if (uri === '') return false;
        //Expressão regular para validar uma URL
        const regexp = /(http):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        //Retorna true ou false para o valor da variável atender ou não a expressão regular
        return regexp.test(uri);
      }

      //Verifica se a string passada é vazia
      function isEmpty(value) {
        return value == null || value.trim() === ''
      }

      //Verifica se a string não é vazia
      function isNotEmpty(value) {
        return !isEmpty(value)
      }

      //Função que valida o valor do campo que a chamou
      function validateField(validationFunc) {
        return function(evt) {
           //Pega o elemento que disparou a função
           const elem = evt.target
           //Verifica se a URL é válida
           const valid = validationFunc(elem.value)
           //Configura o valor do elemento com válido
           toggleValid(elem, valid)
           //Configura o estado da tooltip para ser mostrada ou escondida
           const tooltipAction = !valid ? 'show' : 'hide'
           //Apresenta o esconde a tooltip
           $(elem).tooltip(tooltipAction);
         }
      }

      //Trata o evento de 'perder o foco' do campo de inserir a URI do recurso, validando-o
      //Usa .addEventListener para adidionar mais de uma função ao mesmo evento
      resAboutField.addEventListener('blur', validateField(isValidURL), false)

      //Trata o evento de 'perder o foco' do campo de inserir a URI do vocabulário, validando-o
      vocabURIField.onblur = validateField(isValidURL)

      //Trata o evento de 'perder o foco' do campo de prefixo do vocabulário, validando-o
      vocabularieField.addEventListener('blur', validateField(isNotEmpty), false)
      //Trata o evento de 'mudar o valor selecionado' do campo de prefixo do vocabulário, validando-o
      vocabularieField.addEventListener('change', validateField(isNotEmpty), false)
      //Trata o evento de 'mudar o valor selecionado' do campo de prefixo do vocabulário, carregando as informações do vocabulário escolhido
      vocabularieField.addEventListener('change', (evt) => {
        if (evt.target.value === 'dce') {vocabURIField.value = 'http://purl.org/dc/elements/1.1/'} else
        if (evt.target.value === 'foaf') {vocabURIField.value = 'http://xmlns.com/foaf/0.1/'} else
        if (evt.target.value === 'skos') {vocabURIField.value = 'http://www.w3.org/2004/02/skos/core'} else
        if (evt.target.value === 'schema.org') {vocabURIField.value = 'http://schema.org/'} else
        if (evt.target.value === 'prov') {vocabURIField.value = 'http://www.w3.org/ns/prov#'} else
        if (evt.target.value === 'dcat') {vocabURIField.value = 'http://www.w3.org/ns/dcat'}

        //Pegar os valores do vocabulário escolhido
        fetch('/saveResource/getVocabularyData')
          .then(function(data) {
            return data.json()
            console.log(data)
          })
      })

      //Trata o evento de 'perder o foco' do campo de nome da propriedade, validando-o
      propNameField.onblur = validateField(isNotEmpty)

      //Trata o evento de 'perder o foco' do campo de valor da propriedade, validando-o
      propValueField.onblur = validateField(isNotEmpty)

      //Trata o evento de 'perder o foco' do campo de inserir o prefixo do recurso passando a referência da função showResource para o evento 'onblur'
      resPrefixField.onblur = showResource

      //Trata o evento de 'perder o foco' do campo de inserir a URI do recurso passando a referência da função showResource para o evento 'onblur'
      //Usa .addEventListener para adidionar mais de uma função ao mesmo evento
      resAboutField.addEventListener('blur', showResource, false)

      //Trata o evento de 'perder o foco' do campo de inserir o nome do recurso passando a referência da função showResource para o evento 'onblur'
      resNameField.onblur = showResource

      //Trata o evento de clique do botão de adicionar vocabulários 'addVocabButton'
      addVocabButton.onclick = () => {
        if (isEmpty(vocabURIField.value) || isEmpty(vocabularieField.value)) return

            //Pega o valor do campo de id vocabularie do primeiro formulário e atrabui a uma variável 'prefix'
            const prefix = vocabularieField.value
            //Pega o valor do campo de id vocabURI do primeiro formulário e atrabui a uma variável 'uri'
            const uri = vocabURIField.value
            if (!isValidURL(uri)){
                return;
             }
            toggleValid(vocabURIField, true)
            //Cria objeto 'vocab' com 'name', 'prefix' e uma lista de pares 'pairs'
            const vocab = { prefix, uri, pairs: [] } // { prefix: prefix, uri: uri }
            //Atribui o objeto 'vocab' (inicialmente sem pares) ao vocabulário de prefixo ('prefix'), do recurso
            resource.vocabularies[prefix] = vocab
            //Atualiza a lista de prefixos dos vocabulários usados no campo select
            updatePrefixList()
           //Mostra o recurso na tag '<pre>' de id 'result'
            showResource()
        }

      //Trata o evento de clique do botão de adicionar propriedades 'addPropButton'
      addPropButton.onclick = () => {

        //Pega o valor do campo de id 'propPrefix' do primeiro formulário e atrabui a uma variável 'prefix'
        const prefix = propPrefixField.value
        //Pega o valor do campo de id 'propName' do primeiro formulário e atrabui a uma variável 'name'
        const propertyName = propNameField.value
        //Pega o valor do campo de id 'propValue' do primeiro formulário e atrabui a uma variável 'value'
        const value = propValueField.value

        //Sai da função se algum campo 'prefix', 'propertyName' ou 'value' for vazio
        if (isEmpty(prefix) || isEmpty(propertyName) || isEmpty(value)) return

       //Cria objeto pair com um variáveis 'name' e 'value'
        const pair = { propertyName, value }
        //Atribui o par 'pair' à lista de vocabulários do prefixo 'prefixo' escolhido no select
        resource.vocabularies[prefix].pairs.push(pair)
       //Mostra o recurso na tag '<pre>' de id 'result'
        showResource()
      }

      saveButton.onclick = () => {

        //Verfica se as URIs digitadas são válidas
        if (!validateForm()) return

        //Reseta o alguns campos da página
        resForm.elements.vocabPrefix.value = ''
        resForm.elements.vocabUri.value = ''
        resForm.elements.propName.value = ''
        resForm.elements.propValue.value = ''
        //Mostra o recurso na tag '<pre>' de id 'result'
        showResource()
        //Envia a cópia do recurso
        sendResource()
      }

      //Verifica se os campos de URI do recurso e vocabulário são válidos e
      //se os campos de prefixo do vocabulário, nome da propriedade e valor da propriedade não são vazios
      function validateForm(){
           return isValidURL(resAboutField.value) && isValidURL(vocabURIField.value) &&
                  isNotEmpty(vocabularieField.value) && isNotEmpty(propNameField.value) && isNotEmpty(propValueField.value)
      }

      //Função para mostrar o recurso na tag '<pre>' de id 'result'
      function showResource() {
        //Atualiza os dados do recurso para mostrar
        updateResource()
        //Mostra o RDF
        showRDF()
      }

      //Atualiza os valores do recurso
      function updateResource(){
        //Pega o valor do campo de id 'resPrefix' do primeiro formulário e atrabui a uma variável 'prefix'
        const prefix = resPrefixField.value
        //Pega o valor do campo de id 'resUri' do primeiro formulário e atrabui a uma variável 'name'
        const name = resNameField.value
        //Pega o valor do campo de id 'resAbout' do primeiro formulário e atrabui a uma variável 'about'
        const about = resAboutField.value

        //{ prefix, name, about } equivale a
        //resource.prefix = prefix
        //resource.uri = uri
        //resource.about = about
        //O método Object.assign() é usado para copiar os valores de todas as propriedades próprias enumeráveis de um
        //ou mais objetos de origem para um objeto destino: Object.assign(destino, ...origens)
        //Copia os valores de '{ prefix, name, about }' e adiciona ao resource
        Object.assign(resource, { prefix, name, about })
      }

      //Envia o recurso
      function sendResource() {
        //Faz uma cópia do resultado e atrabui à variávek resToShow
        const resToSend = getResourceToSend()
        //Envia a cópia do recurso

        //Envia o conteúdo ao servidor
        fetch('/saveResource/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8'},
          body: JSON.stringify(resToSend)
        }).then(function(status) {
          //Verifica se o status da mensagem inicia com 2. Podendo ser 2xx, onde x pode ser qualquer número
          if(status.toString()[0] === '2')
            result.innerHTML += '<br/><br/><h3>Recurso salvo com sucesso</h3>'
          else
            result.innerHTML += `<br/><br/><h3>Erro ao tentar gravar ontologia</h3><br/>${status.message}`
        //Este bloco trata o evento da conexão estar indisponível
        }).catch(function(error) {
            result.innerHTML += `<br/><br/><h3>Problema de conexão ao tentar salvar a ontologia<h3><br/><br/>${error.message}`
          });
      }

      //Faz um recurso para ser enviado
      function getResourceToSend() {
        //Pega a lista de valores dos vocabulários do recurso
        const vocabularies = Object.values(resource.vocabularies)
        //O método Object.assign() é usado para copiar os valores de todas as propriedades próprias enumeráveis de um
        //ou mais objetos de origem para um objeto destino: Object.assign(destino, ...origens)
        const resToSend = Object.assign({}, resource)
        //Atribui os vocabularios 'vocabularies' à lista de vocabulários da cópia do recurso
        resToSend.vocabularies = vocabularies
        //Retorna resToSend
        return resToSend

      }

      //Função para atualizar a lista de prefixos do campo select de prefixos dos vocabulários usados
      function updatePrefixList() {
        //Object.keys pega a lista de prefixos dos vocabulários do recurso
        //A função map itera sobre a lista de prefixos dos vocabulários
        //Cada chave da lista de 'prefix' é passada como parâmetro para a função anônima que retorna a string dentro da crase `...`
        //A string detro da crase aceita string e variáveis, que podem ser acessadas com a seguinte sintaxe ${variavel}
        const options = Object.keys(resource.vocabularies).map(prefix => (
          `<option value="${prefix}">${prefix}</option>`
        ))
        //Atualiza lista de prefixos do campo select de id 'propPrefix'
        resForm.elements.propPrefix.innerHTML = options
      }

        //Mostra o RDF, essa função é chamada para montar o conteúdo a ser mostrado na tag '<pre>'
        const showRDF = () => {
            //Pega um recurso a ser enviado
            const resToSend = getResourceToSend();
            //Monta a string que mostra todos os vocabulários usados
            let vocabularies = resToSend.vocabularies.map(vocab => `xmlns:${vocab.prefix}="${vocab.uri}"`).join("\n    ");
            //Cria uma variável que vai ser usada para guardar todas as propriedades de todos os vabulários usados
            let props = [];
            //Adiciona um prefixo a cada par de valores com o mesmo prefixo do vocabulário
            for (let vocab of resToSend.vocabularies) {
                const pairs = vocab.pairs.map(pair =>
                    Object.assign({}, pair, { prefix: vocab.prefix })
                )
                //Adiciona o par (agora com o prefixo) à lista de propriedades
                props = props.concat(pairs)
            }

            //Monta a string que mostra todas a propriedades usadas
            const propsString = props
                .map(prop => `<${prop.prefix}:${prop.propertyName}>${prop.value}</${prop.prefix}:${prop.propertyName}>`)
                .join("\n        ")

            //Verifica se o prefixo do recurso ou seu nome não são vazios e adiciona à lista de vocabulários
            if (!isEmpty(resource.prefix) && !isEmpty(resource.name)) {
                vocabularies = `xmlns:${resource.prefix}="${resource.about}"\n    ` + vocabularies
            }
            //Verifica se o nome do recurso é vazio e apresenta 'rdf:Desciption' se for
            const rootNode = isEmpty(resource.name) ? 'rdf:Description' : `${resource.prefix}:${resource.name}`

            const rdf = `
<rdf:RDF
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns"
    ${vocabularies}
>
    <${rootNode} rdf:about="${resource.about}/uid">
        ${propsString}
    </${rootNode}>
</rdf>`;

            //Deve ser usado innerText para apresentar o texto e não o html na página
            result.innerText = rdf;
        }


}())