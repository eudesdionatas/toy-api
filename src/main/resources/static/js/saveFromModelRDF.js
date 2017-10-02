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
      //Pega o campo de colocar a URI do recuro e atribui a uma variável 'resAboutField'

      const resPrefixField = document.getElementById('resPrefix')
      const resNameField = document.getElementById('resName')
      const resAboutField = document.getElementById('resAbout')

      //Pega o campo de colocar a URI do vocabulário e atribui a uma variável 'vocabURIField'
      const vocabURIField = document.getElementById('vocabUri')
      const vocabPrefixField = document.getElementById('vocabPrefix')

      const propPrefixField = document.getElementById('propPrefix')
      const propNameField = document.getElementById('propName')
      const propValueField = document.getElementById('propValue')


      //Cria objeto resource com um objeto vocabularies dentro
      const resource = {
        vocabularies: {}
      }

      $('[data-toggle="tooltip"]').tooltip({ trigger: 'manual' })

      function toggleValid(elem, valid) {
        valid ? elem.classList.remove('has-error') : elem.classList.add('has-error')
      }

      function isValidURL(uri){
        if (uri === '') return false;
        //Expressão regular para validar uma URL
        const regexp = /(http):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        //Retorna true ou false para o valor da variável atender ou não a expressão regular
        return regexp.test(uri);
      }

      function isEmpty(value) {
        return value == null || value.trim() === ''
      }

      function isNotEmpty(value) {
        return !isEmpty(value)
      }

      function validateField(validationFunc) {
        return function(evt) {
           //Verifica se a URL é válida
           const elem = evt.target
           const valid = validationFunc(elem.value)
           toggleValid(elem, valid)
           const tooltipAction = !valid ? 'show' : 'hide'
           $(elem).tooltip(tooltipAction);
         }
      }

      //Trata o evento de 'perder o foco' do campo de inserir a URI do recurso
      resAboutField.onblur = validateField(isValidURL)

      //Trata o evento de 'perder o foco' do campo de inserir a URI do vocabulário
      vocabURIField.onblur = validateField(isValidURL)

      vocabPrefixField.onblur = validateField(isNotEmpty)

      propNameField.onblur = validateField(isNotEmpty)

      propValueField.onblur = validateField(isNotEmpty)

      resPrefixField.onblur = showResource

      resAboutField.onblur = showResource

      resNameField.onblur = showResource

      //Trata o evento de clique do botão de adicionar vocabulários 'addVocabButton'
      addVocabButton.onclick = () => {
        if (isEmpty(vocabURIField.value) || isEmpty(vocabPrefixField.value)) return

        //Pega o valor do campo de id vocabPrefix do primeiro formulário e atrabui a uma variável 'prefix'
        const prefix = vocabPrefixField.value
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

      function validateForm(){
           return isValidURL(resAboutField.value) && isValidURL(vocabURIField.value)
      }

      //Função para mostrar o recurso na tag '<pre>' de id 'result'
      function showResource() {
        updateResource()
        showRDF()
      }

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

      function sendResource() {
        //Faz uma cópia do resultado e atrabui à variávek resToShow
        const resToSend = getResourceToSend()
        //Envia a cópia do recurso

        console.log(resToSend)
        fetch('/saveResource/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8'},
          body: JSON.stringify(resToSend)
        })
      }

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

        const showRDF = () => {
            const resToSend = getResourceToSend();
            let vocabularies = resToSend.vocabularies.map(vocab => `xmlns:${vocab.prefix}="${vocab.uri}"`).join("\n    ");
            let props = [];
            for (let vocab of resToSend.vocabularies) {
                const pairs = vocab.pairs.map(pair =>
                    Object.assign({}, pair, { prefix: vocab.prefix })
                )
                props = props.concat(pairs)
            }

            const propsString = props
                .map(prop => `<${prop.prefix}:${prop.propertyName}>${prop.value}</${prop.prefix}:${prop.propertyName}>`)
                .join("\n        ")

            if (!isEmpty(resource.prefix) && !isEmpty(resource.name)) {
                vocabularies = `xmlns:${resource.prefix}="${resource.about}"\n    ` + vocabularies
            }
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

            result.innerText = rdf;
        }


}())