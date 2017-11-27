(
    function() {

      //Pega o primeiro formulário da página e atrabui a uma variável 'resForm'
      const resForm = document.forms[0]

      //Pega os botões da página e atrabui a uma variável
      const addVocabButton = document.getElementById('addVocab')
      const addPropButton = document.getElementById('addProp')
      const addSubpropButton = document.getElementById('addSubprop')
      const saveButton = document.getElementById('save')

      //Pega a tag <pre> de id result e atrabui a uma variável 'result'
      const result = document.getElementById('result')

      //Pega os campos de inserir os dados do recuro e atribui e atribui a variáveis
      const resPrefixField = document.getElementById('resPrefix')
      const resNameField = document.getElementById('resName')
      const resAboutField = document.getElementById('resAbout')

      //Pega os campos de inserir os dados do vocabulário e atribui e atribui a variáveis
      const vocabURIField = document.getElementById('vocabUri')
      const vocabulariePrefixField = document.getElementById('vocabPrefix')

      //Pega os campos de inserir os dados da propriedades e atribui e atribui a variáveis
      const propPrefixField = document.getElementById('propPrefix')
      const propNameField = document.getElementById('propName')
      const propValueField = document.getElementById('propValue')
      const subpropNameField = document.getElementById('subpropName')
      const subpropValueField = document.getElementById('subPropValue')

      const propertyAsResourceCheck = document.getElementById('propAsResource')
      const subPropertyAsResourceCheck = document.getElementById('subPropAsResource')
      const hasSubproperty = document.getElementById('hasSubproperty')

      const vocabs = {
        cc: 'http://creativecommons.org/ns#',
        dcat: 'http://www.w3.org/ns/dcat#',
        dce: 'http://purl.org/dc/elements/1.1/',
        dcterms: 'http://purl.org/dc/terms/',
        event: 'http://purl.org/NET/c4dm/event.owl#',
        foaf: 'http://xmlns.com/foaf/0.1/',
        prov: 'http://www.w3.org/ns/prov#',
        vcard: 'http://www.w3.org/2006/vcard/ns#',
        schema: 'http://schema.org/',
        skos: 'http://www.w3.org/2004/02/skos/core#',
        geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#'
      }

      //Cria objeto resource com um objeto vocabularies dentro
      const resource = {
        vocabularies: {}
      }
      

      //Trata o evento de 'perder o foco' do campo de inserir a URI do recurso, validando-o
      //Usa .addEventListener para adidionar mais de uma função ao mesmo evento
      resAboutField.addEventListener('blur', validateField(isValidURL), false)
      
      subpropValueField.addEventListener('blur', validateField(isNotEmpty), false)
      
      //Trata o evento de 'perder o foco' do campo de inserir a URI do vocabulário, validando-o
      vocabURIField.onblur = validateField(isValidURL)

      //Trata o evento de 'perder o foco' do campo de prefixo do vocabulário, validando-o
      vocabulariePrefixField.addEventListener('blur', validateField(isNotEmpty), false)
      //Trata o evento de 'mudar o valor selecionado' do campo de prefixo do vocabulário, validando-o
      vocabulariePrefixField.addEventListener('change', validateField(isNotEmpty), false)

      //Trata o evento de 'perder o foco' do campo de valor da propriedade, validando-o
      propValueField.onblur = validateField(isNotEmpty)
      
      //Trata o evento de 'perder o foco' do campo de inserir o prefixo do recurso passando a referência da função showResource para o evento 'onblur'
      resPrefixField.addEventListener('blur', showResource)

      resPrefixField.addEventListener('blur', validateField(isNotEmpty))

      //Trata o evento de 'perder o foco' do campo de inserir a URI do recurso passando a referência da função showResource para o evento 'onblur'
      //Usa .addEventListener para adidionar mais de uma função ao mesmo evento
      resAboutField.addEventListener('blur', showResource)

      //Trata o evento de 'perder o foco' do campo de inserir o nome do recurso passando a referência da função showResource para o evento 'onblur'
      resNameField.addEventListener('blur', showResource)

      resNameField.addEventListener('blur', validateField(isNotEmpty))

      propPrefixField.addEventListener('blur', validateField(isNotEmpty))

      $(propNameField).on('select2:close', validateField(updateProperties))

      $(propNameField).on('select2-blur', validateField(showHideSubpropertiesFields))
      
      subpropNameField.addEventListener('blur', showResource)

      subpropValueField.addEventListener('blur', showResource)

      //Trata o evento de 'mudar o valor selecionado' do campo de prefixo do vocabulário, carregando as informações do vocabulário escolhido
      vocabulariePrefixField.addEventListener('change', (evt) => {
        vocabURIField.value = vocabs[evt.target.value]
      })


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
           //Retorna se o campo ´válido ou não
           return valid
         }
      }


      propertyAsResourceCheck.addEventListener('click', (evt) => {
        if (propertyAsResourceCheck.checked === true){
          $("#propValue").attr({'title': 'As URIs devem ser válidas: http://... terminando com / ou #'});
        }else{
          $("#propValue").attr({'title': 'Insira um valor'});
        }
      })

      hasSubproperty.addEventListener('click', (evt) => {
        if (hasSubproperty.checked === true){

/*
          if (isEmpty(propNameField.value)){
            hasSubproperty.checked = false
            alert('Campo de nome da propriedade está vazio')
            return
          }
*/        
          
          propertyAsResourceCheck.checked = true
          propValueField.onblur = validateField(isValidURL)
          $("#propValue").attr({'title': 'As URIs devem ser válidas: http://... terminando com / ou #'});
          propertyAsResourceCheck.onclick = () => {return false}
          document.getElementById('divSubproperty').style.display = 'block'
          document.getElementById('propValueDiv').style.visibility = "hidden"
          addSubpropButton.onclick = addSubpropFunc
        }else {
          subpropNameField.value = ''
          subpropValueField.value = ''
          document.getElementById('divSubproperty').style.display = 'none'
          propertyAsResourceCheck.onclick = () => {return true}
          document.getElementById('propValueDiv').style.visibility = "visible"
        }
        updateProperties()
      })

      subPropertyAsResourceCheck.addEventListener('click', (evt) =>{
        if(subPropertyAsResourceCheck.checked === true){
          //subpropValueField.setAttribute("title", "As URIs devem ser válidas: http://... terminando com / ou #")
          $("#subPropValue").attr({'title': 'As URIs devem ser válidas: http://... terminando com / ou #'});
          //subpropValueField.addEventListener('blur', validateField(isValidURL), false)
        }
        else{
          $("#subPropValue").attr({'title': 'Insira um valor'});
          //subpropValueField.onblur = validateField(isNotEmpty)
        }
      })
      
      propPrefixField.addEventListener('change', (evt) => {
          //Pegar os valores do vocabulário escolhido
          console.log(1)
          fetch('/resources/getVocabularyData?'+ $.param({vocabPrefix: propPrefixField.value}))
          .then(function(data) {
            console.log(JSON.stringify(data))
            return data.json()
          }).then(function(predicates) {
            console.log(predicates)
          })    
      })

      $('#propName').select2({ 
        ajax: { 
          url: '/resources/getVocabularyData',
          dataType: 'json',  
          data: function (params) { 
            // Query parameters will be ?vocabPrefix=[propPrefixField.value]&search=[term]&type=public 
            var query = {vocabPrefix: propPrefixField.value, search: params.term}
            return query; 
          },
          // Tranforms the top-level key of the response object from 'items' to 'results'
          processResults: function (data) {
            items = data
            //Coloca a estrutura do JSON da forma correta para não ter <OptGroup></OptGroup>
            //const items = data.map(prop => ({ id: prop, text: prop }))
            return {results: items};
          },
          cache: true                
        },
        placeholder: 'Digite as iniciais da propriedade',
        theme: 'bootstrap'
      });
      
      $('#subpropName').select2({ 
        ajax: { 
          url: '/resources/getVocabularyData',
          dataType: 'json',  
          data: function (params) { 
            // Query parameters will be ?vocabPrefix=[propPrefixField.value]&search=[term]&type=public 
            var query = {vocabPrefix: propPrefixField.value, search: params.term}
            return query; 
          },
          // Tranforms the top-level key of the response object from 'items' to 'results'
          processResults: function (data) {
            items = data
            //Coloca a estrutura do JSON da forma correta para não ter <OptGroup></OptGroup>
            //const items = data.map(prop => ({ id: prop, text: prop }))
            return {results: items};
          },
          cache: true                
        },
        placeholder: 'Digite as iniciais da propriedade',
        theme: 'bootstrap'
      });


      //Trata o evento de clique do botão de adicionar vocabulários 'addVocabButton'
      addVocabButton.onclick = () => {
        if (isEmpty(vocabURIField.value) || isEmpty(vocabulariePrefixField.value)) return

            //Pega o valor do campo de id vocabularie do primeiro formulário e atrabui a uma variável 'prefix'
            const prefix = vocabulariePrefixField.value
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
        const prefix        = propPrefixField.value
        //Pega o valor do campo de id 'propName' do primeiro formulário e atrabui a uma variável 'name'
        const propertyName  = propNameField.value
        //Pega o valor do campo de id 'propValue' do primeiro formulário e atrabui a uma variável 'value'
        const value         = propValueField.value

        const asResource    = propertyAsResourceCheck.checked

        //Sai da função se algum campo 'prefix', 'propertyName' ou 'value' for vazio
        if(!propertyAsResourceCheck){
          if (isEmpty(prefix) || isEmpty(propertyName) || isEmpty(value)){
            result.innerHTML = 'Campo(s) requerido(s) vazio(s)'
            return
          } else{
            result.innerHTML = ''
          } 
        } else {
          
          const vocabularies = getResourceToSend().vocabularies

          const qtPairs = pairsSize(vocabularies)
          
          if(qtPairs == 0 && !propertyAsResourceCheck.checked && !subPropertyAsResourceCheck.checked && isNotEmpty(propNameField.value) && isNotEmpty(propValueField.value)){
            //Cria objeto pair com um variáveis 'name' e 'value'
            const pair = {propertyName, value, asResource, subPropertyOf:''}
            //Atribui o par 'pair' à lista de vocabulários do prefixo 'prefixo' escolhido no select
            resource.vocabularies[prefix].pairs.push(pair)
          }
          else if(!valueExists(pairs) && isNotEmpty(propValueField.value)){
            //Cria objeto pair com um variáveis 'name' e 'value'
            const pair = {propertyName, value, asResource, subPropertyOf:''}
            //Atribui o par 'pair' à lista de vocabulários do prefixo 'prefixo' escolhido no select
            resource.vocabularies[prefix].pairs.push(pair)
          }
        }
       //Mostra o recurso na tag '<pre>' de id 'result'
       console.log(JSON.stringify(resource.vocabularies))
       showResource()
      }

      function getPairs(vocabularies){
        pairs = []
        for (let vocabularie of vocabularies){
          for(let pair of vocabularie.pairs){
            pairs.push(pair)
          }
        }
        return pairs
      }

      function pairsSize(vocabularies){
        pairs = []
        let qtPairs = 0
        for (let vocabularie of vocabularies){
          for(let pair of vocabularie.pairs){
            qtPairs++
          }
        }
        return qtPairs
      }

      function valueExists(pairs){
        for (let pair of pairs){
          if(pair.propertyName === propNameField.value || pair.propertyName === subpropNameField.value)
            return true
        }
          return false
      }


      function addSubpropFunc() {
        
        if (isEmpty(propPrefixField.value) || isEmpty(propNameField.value) || isEmpty(subpropNameField.value) || isEmpty(subpropValueField.value)){
          result.innerHTML += '\n\nCampo(s) requerido(s) vazio(s)'
          return
        } else{
          showResource()
        } 
        updateProperties()        
      }

      function showHideSubpropertiesFields(){
        if (isEmpty(propNameField.value) && propertyAsResourceCheck.checked){
          document.getElementById('propValueDiv').style.visibility = "hidden"
          document.getElementById('divSubproperty').style.display = 'none'
        }
        else{
          document.getElementById('propValueDiv').style.visibility = "visible"
          document.getElementById('divSubproperty').style.display = 'block'
        }
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
                  isNotEmpty(vocabulariePrefixField.value) && isNotEmpty(propNameField.value) && isNotEmpty(propValueField.value)
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

      /**
       * Função que verifica se um novo par pode ser adicionado. Isso é necessário para tratar do evento 'blur' dos campos select2
       * Existe um momento em que um novo por precisa ser adicionado
       * @param {*} vocabularies 
       */
      function canNotAddNewPropertie(vocabularies){

/*      
        Se o tamanho do vocabulário for > 0
          É um recurso 
            Com subpropriedades 
              com uma nova subpropriedade pra inserir
                  Subpropriedade é um recurso
                  Subpropriedade não é um recurso
              Sem uma nova subpropriedade pra inserir
            Sem subpropriedades
          Não é um recurso
            Com novos valores para inserir
              Valores já existem
              Valores não existem
            Sem novos valores
        Senão retorna falso
 */     
          //Verifica se ainda não existem pares inseridos
          
          const qtPairs = pairsSize(vocabularies)

          //Recurso com subpropriedades sem o nome do recurso ainda
          if ((qtPairs == 0) && isEmpty(propNameField.value) && propertyAsResourceCheck.checked && hasSubproperty.checked) {
            return true
          }
          //Recurso com subpropriedades e com os valores da subpropriedade
          else if (qtPairs > 0 && isNotEmpty(propNameField.value) && propertyAsResourceCheck.checked && hasSubproperty.checked){
            for (let vocabularie of vocabularies){
              for(let pair of vocabularie.pairs){
                //Os campos de subpropriedade não estão vazios
                if((isNotEmpty(subpropNameField.value) || isNotEmpty(subpropValueField.value))){
                  //O nome da propriedade já inserida é igual ao valor do nome da subpropriedade
                  if(pair.propertyName === subpropNameField.value && hasSubproperty.checked)
                    return true
                }
                //Ambos os campos da subpropriedade são vazios e o nome do recurso com subpropriedades não pode se repetir
                else if(pair.propertyName === propNameField.value){
                    return true
                }
                //Retorna falso para qualquer outro caso
                else
                  return false                
              }
            }
          }
          //Propriedade que não é recurso e não tem subpropriedades mas não tem o valor para inserir
          else if (qtPairs == 0 && !propertyAsResourceCheck.checked && !hasSubproperty.checked && isEmpty(propValueField.value)){
            return true
          }
          //Propriedade que é recurso e não tem subpropriedades mas não tem o valor para inserir
          else if (qtPairs == 0 && propertyAsResourceCheck.checked && !hasSubproperty.checked && isEmpty(propValueField.value)){
            return true
          }
          //Propriedade que não é recurso e não tem subpropriedades com o valor para inserir
          else if (qtPairs == 0 && propertyAsResourceCheck.checked && !hasSubproperty.checked && isNotEmpty(propValueField.value)){
            for (let pair of pairs){
              if(propNameField.value == pair.propertyName)
                return true
            }
            return false
          }
          //Propriedade que é recurso e não tem subpropriedades com o valor para inserir
          else if (qtPairs == 0 && propertyAsResourceCheck.checked && !hasSubproperty.checked && isNotEmpty(propValueField.value)){
            for (let pair of pairs){
              if(propNameField.value == pair.propertyName)
                return true
            }
            return false
          }
        
          /**********************************************************************************************/                   
          //Caso já exista um par inserido verifica os valores de cada um deles com os valores dos campos
          /**********************************************************************************************/
          for(let vocabularie of vocabularies){
            for(let pair of vocabularie.pairs){
              
              //É um recurso o par inserido
              if(propertyAsResourceCheck.checked){
                
                //O par analisado tem subpropriedades
                //{'nomeDaPropriedade', '', true, ''}
                if(isEmpty(pair.value) && isEmpty(pair.subPropertyOf)){
                  
                  //Existem dados para inserir a nova subpropriedade
                  if(isNotEmpty(subpropNameField.value) && isNotEmpty(subpropValueField.value)){
                    
                    //Subpropriedade sendo inserida é um recurso
                    if(subPropertyAsResourceCheck.checked){
                      //Se existir algum par que tiver os mesmos valores dos que estão sendo inseridos
                      if ((subpropNameField.value === pair.propertyName || propNameField.value === pair.subPropertyOf) && pair.asResource && isNotEmpty(pair.subPropertyOf))
                        return true
                    }
                    //Subpropriedade sendo inserida não é um recurso
                    else{
                      if ((subpropNameField.value === pair.propertyName || propNameField.value === pair.subPropertyOf) && !pair.asResource && isNotEmpty(pair.subPropertyOf))
                      return true
                    }
                  }
                  //Não existem dados para inserir a nova subpropriedade
                  //Retornar falso indica que existe a necessidade de insetir um novo par que represente um recurso com subpropriedades
                  //{'nomeDaPropriedade', '', true, ''}
                  else {
                      return true
                  }
                }
                //Recurso não tem subpropriedades ou não é subpropriedade
                //{'site', 'http://eudes.com', true, ''}
                else if(!propertyAsResourceCheck.checked && isEmpty(pair.subPropertyOf)){
                    return true
                }
                //Não insere se o par já foi inserido
                else if ((pair.propertyName == propNameField.value || pair.propertyName == subpropNameField.value)){
                    return true
                }
                else return false
              }
              //Não é um recurso
              // {'name', 'Eudes Souza', false, ''}
             //Semão se algum dos campos estiver vazio e se não tiver nenhuma propriedade repetida pode adicionar
              else if ((isNotEmpty(propNameField.value))){
                if (isEmpty(propValueField.value)) return true
                for (let pair of pairs){
                  if(propNameField.value == pair.propertyName || isNotEmpty(propValueField.value))
                    return true
                }
              }
              //
              else if (isEmpty(pair.subPropertyOf) && (subpropNameField.value === pair.propertyName)){
                //Se a propriedade já existir não permite adicionar
                for (let pair of pairs){
                  if(propNameField.value != pair.propertyName)
                    return false
                }                    
                return true
              }
            }
          }
          return false
      }      
      
      function updateProperties(){
        propValueField.value = ''
        
/*        
        É um recurso 
          Com subpropriedades 
            com uma nova subpropriedade pra inserir
                Subpropriedade é um recurso
                Subpropriedade não é um recurso
            Sem uma nova subpropriedade pra inserir
          Sem subpropriedades
        Não é um recurso
 */       
        const vocabularies = getResourceToSend().vocabularies

        if(canNotAddNewPropertie(vocabularies))
          return
        
        //Pega o valor do campo de id 'propPrefix' do primeiro formulário e atrabui a uma variável 'prefix'
        const prefix        = propPrefixField.value
        //Pega o valor do campo de id 'propValue' do primeiro formulário e atrabui a uma variável 'value'
        const value         = propValueField.value
        
        //A propriedade é marcada como um recurso
        if(propertyAsResourceCheck.checked){
          // Se a propropriedade tem subpropriedades... 
          if(hasSubproperty.checked){
            //Adiciona um par se os campos das subpropriedades forem vazios no formato <vocaba:propriedade rdf:parseType="Resource">
            if(isEmpty(subpropNameField.value) && isEmpty(subpropValueField.value) && pairsSize(vocabularies) == 0){
              const pair = {propertyName: propNameField.value, value: '', asResource: true, subPropertyOf: ''}
              resource.vocabularies[prefix].pairs.push(pair)
            }
            //Senão, se a lista de pares não for vazia e os campos da subpropriedade não forem vazios
            else if (pairsSize(vocabularies) > 0 && isNotEmpty(subpropNameField.value) && isNotEmpty(subpropValueField.value)){
              pairs     = getPairs(vocabularies)
              if(!valueExists(pairs)){
                const pair = {propertyName: subpropNameField.value, value: '', asResource: true, subPropertyOf: ''}
                resource.vocabularies[prefix].pairs.push(pair)
              }
            } 
            
            //Senão, adiciona um par se os campos das subpropriedades não forem vazios
            if (isNotEmpty(subpropNameField.value) && isNotEmpty(subpropValueField.value)){
              //Se a subpropriedade é marcada como recurso: <vocab:propriedade rdf:about="http://site.com>
              if(subPropertyAsResourceCheck.checked && subpropValueField.value.includes("http://")){
                const pair = {propertyName: subpropNameField.value, value: subpropValueField.value, asResource: true, subpropertyOf: propNameField.value} 
                resource.vocabularies[prefix].pairs.push(pair)
              }
              //Senão, se a subpropriedade não for marcada como um recurso: <vocab:prop>valor</vocab:prop>
              else
              if (!subPropertyAsResourceCheck.checked){
                const pair = {propertyName: subpropNameField.value, value: subpropValueField.value, asResource: false, subPropertyOf: propNameField.value}
                resource.vocabularies[prefix].pairs.push(pair)
              }
            }
          }//Senão, se a propriedade é um recurso e não tem subpropriedades
          else if (propertyAsResourceCheck.checked && isEmpty(propValueField.value)){
            const pair = {propertyName: subpropNameField.value, value: subpropValueField.value, asResource: true, subpropertyOf:''} 
            resource.vocabularies[prefix].pairs.push(pair)
      }
        }
        //Se a propriedade não é marcada como um recurso
        else {
          const pair = {propertyName: propNameField.value, value: propValueField.value, asResource: false, subPropertyOf: ''}  
          resource.vocabularies[prefix].pairs.push(pair)
        }

        console.log(JSON.stringify(resource.vocabularies[prefix].pairs))
        //Mostra o recurso na tag '<pre>' de id 'result'
        showResource()
      }

      //Envia o recurso
      function sendResource() {
        //Faz uma cópia do resultado e atrabui à variávek resToShow
        const resToSend = getResourceToSend()
        //Envia a cópia do recurso

        //Envia o conteúdo ao servidor
        fetch('/resources/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8'},
          body: JSON.stringify(resToSend)
        }).then(function(response) {
          //Verifica se o status da mensagem inicia com 2. Podendo ser 2xx, onde x pode ser qualquer número
          if(response.ok)
            result.innerHTML += '<br/><br/><h3>Recurso salvo com sucesso</h3>'
          else
            result.innerHTML += `<br/><br/><h3>Erro ao tentar gravar ontologia</h3><br/>${response.status}<br/>${response.status.message}</br>${status.toString}`
        //Este bloco trata o evento da conexão estar indisponível
        }).catch(function(error) {
            result.innerHTML += `<br/><br/><h3>Problema de conexão ao tentar salvar a ontologia<h3><br/><br/>${error.message}`
          });
      }

      //Faz um recurso para ser enviado
      function getResourceToSend() {
        //Pega a lista de valores dos vocabulários do recurso
        const vocabularies  = Object.values(resource.vocabularies)
        //O método Object.assign() é usado para copiar os valores de todas as propriedades próprias enumeráveis de um
        //ou mais objetos de origem para um objeto destino: Object.assign(destino, ...origens)
        const resToSend     = Object.assign({}, resource)
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
        const prefixes = Object.keys(resource.vocabularies) 
        const options = prefixes.map(prefix => (
          `<option value="${prefix}">${prefix}</option>`
        ))
        //Atualiza lista de prefixos do campo select de id 'propPrefix'
        resForm.elements.propPrefix.innerHTML = options
        resForm.elements.propPrefix.value = prefixes[prefixes.length - 1]
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
            //const propsString = props
            //   .map(prop => `<${prop.prefix}:${prop.propertyName}>${prop.value}</${prop.prefix}:${prop.propertyName}>`)
            //    .join("\n        ")
            const propsString = mountPropertyString(props)


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

      function mountPropertyString(props){
        
        const verifiedProps = props.map(prop => Object.assign({}, prop, { isVerified: false }))
        let RDFprops = []

/*        
        É um recurso 
          Com subpropriedades 
            com uma nova subpropriedade pra inserir
                Subpropriedade é um recurso
                Subpropriedade não é um recurso
            Sem uma nova subpropriedade pra inserir
          Sem subpropriedades
        Não é um recurso
 */       


        //Laço para para percorrer todas a propriedades
        for (let i = 0; i < verifiedProps.length; i++){
          
          //Se a propriedade é um recurso
          if(verifiedProps[i].asResource){
            
            //Se a propriedade é um recurso e tem subpropriedades... <vocaba:propriedade rdf:parseType="Resource">
            if(isEmpty(verifiedProps[i].value) && isEmpty(verifiedProps[i].subPropertyOf)){

              RDFprops.push(`<${verifiedProps[i].prefix}:${verifiedProps[i].propertyName} rdf=parseType="Resource" />`)
              
              //Slice cria uma cópia do array
              const copyVerifiedProps = verifiedProps.slice()
              //Laço para percorrer todo o array da cópia das propriedades
              let K = 0
              for (let k = 0; k < copyVerifiedProps.length; k++){
                K_ = k
                //Se o nome da propriedade i é igual à subpropriedade k 
                if(verifiedProps[i].propertyName === copyVerifiedProps[k].subPropertyOf){
                  //Subpropriedade é um recurso
                  if(verifiedProps[i].asResource && isNotEmpty(verifiedProps[i].propertyName) && isNotEmpty(verifiedProps[i].value)){
                    RDFprops.push(`    <${copyVerifiedProps[k].prefix}:${copyVerifiedProps[k].propertyName } rdf:resource="${copyVerifiedProps[k].value}"/>`)
                  }
                  //Se subpropriedade não é um recurso
                  else if (!verifiedProps[i].asResource && isNotEmpty(verifiedProps[i].propertyName) && isNotEmpty(verifiedProps[i].value)){
                    RDFprops.push(`    <${verifiedProps[i].propertyName}:${copyVerifiedProps[k].propertyName}>${copyVerifiedProps[k].value}</${verifiedProps[i].propertyName}:${copyVerifiedProps[k].propertyName}>`)
                  }
                  verifiedProps[k].isVerified = true
                }
              }
              RDFprops.push(`</${copyVerifiedProps[K_].prefix}:${verifiedProps[i].propertyName}>`)
              verifiedProps[i].isVerified = true
            }
            //Senão, se a propriedade é um recurso e não tem subpropriedades
            else if (isEmpty(verifiedProps[i].subPropertyOf)){
              RDFprops.push(`<${verifiedProps[i].prefix}:${verifiedProps[i].propertyName} rdf:resource="${verifiedProps[i].value}"/>`)
            }
          } 
          //Senão, se a propriedade não é um recurso
          else {
            RDFprops.push(`<${verifiedProps[i].prefix}:${verifiedProps[i].propertyName}>${verifiedProps[i].value}</${verifiedProps[i].propertyName}:${verifiedProps[i].propertyName}>`)
          }
        }
        RDFprops = RDFprops.join('\n        ')
        return RDFprops
      }          
            
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
         /* 
          
          //Represents the property like a comom tag: <vocab:property>value</vocab:property>
          //If the pair was'nt verified yet and the value of his property isn't empty and the value of his property not contais "http://" and is a resource and the value of the subproperty is empty
          if (!(verifiedProps[i].isVerified) && !(verifiedProps[i].value === '') && !(verifiedProps[i].value.includes("http://")) && !(verifiedProps[i].asResource) && (verifiedProps[i].subPropertyOf === '')){
            RDFprops.push(`<${verifiedProps[i].prefix}:${verifiedProps[i].propertyName}>${verifiedProps[i].value}</${verifiedProps[i].prefix}:${verifiedProps[i].propertyName}>`) 
          } 
            //Represents the property that have one simple resource: <vocab:property rdf:resource="http://site.com"/>
          //If the pair was'nt verified yet and the value of his property contais "http://" and is a resource and the value of the subproperty is empty
          else if(!(verifiedProps[i].isVerified) && (verifiedProps[i].value.includes("http://")) && (verifiedProps[i].asResource) && (verifiedProps[i].subPropertyOf === '')){
            RDFprops.push(`<${verifiedProps[i].prefix}:${verifiedProps[i].propertyName} rdf:resource=${verifiedProps[i].value} />`)
          } 
          //Represents the begins of a resource: <vocab:property rdf:parseType="Resource">
          //If the pair was'nt verified yet and the value of his property is empty and is a resource and the value of the subproperty is empty
          else if(!(verifiedProps[i].isVerified) && (verifiedProps[i].value === '') && (verifiedProps[i].asResource) && (verifiedProps[i].subPropertyOf === '')){
            RDFprops.push(`<${verifiedProps[i].prefix}:${verifiedProps[i].propertyName} rdf=parseType="Resource" />`)
            
            //Slice cria uma cópia do array
            const copyVerifiedProps = verifiedProps.slice()
            //Laço para percorrer todo o array da cópia das propriedades
            let K = 0
            for (let k = 0; k < copyVerifiedProps.length; k++){
              K_ = k
              
               //Se o nome da propriedade i é igual à subpropriedade k 
              if(verifiedProps[i].propertyName === copyVerifiedProps[k].subPropertyOf){
                //Ou é um recurso ou não
                if (copyVerifiedProps[k].value.includes("http://") && subPropertyAsResourceCheck.checked){
                  RDFprops.push(`        <${copyVerifiedProps[k].prefix}:${copyVerifiedProps[k].propertyName } rdf:resource=${copyVerifiedProps[k].value} />`)
                }
                else {
                  RDFprops.push(`        <${verifiedProps[i].propertyName}:${copyVerifiedProps[k].propertyName}>${copyVerifiedProps[k].value}</${verifiedProps[i].propertyName}:${copyVerifiedProps[k].propertyName}>`)  
                }
                verifiedProps[k].isVerified = true
              }
            }
            RDFprops.push(`</${copyVerifiedProps[K_].prefix}:${verifiedProps[i].propertyName}>`)
            verifiedProps[i].isVerified = true
          }
        }  
        RDFprops = RDFprops.join('\n        ')
        return RDFprops
      }*/
}()
)

