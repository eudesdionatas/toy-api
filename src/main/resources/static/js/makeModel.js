(
    function(){
        const vocabs = [];
        const props = [];
        const uri = document.getElementById("uri");
        const prefix = document.getElementById('prefix');
        const addVocab = document.getElementById('addVocab');
        const vocabList = document.getElementById('vocabList');
        const propPrefix = document.getElementById('propPrefix');
        const propName = document.getElementById('propName');
        const addProp = document.getElementById('addProp');
        const result = document.getElementById('result');

        addVocab.addEventListener("click", function(){
//            vocabs.push({
//                uri: uri.value,
//                prefix: prefix.value
//            });
            vocabList.innerText = JSON.stringify(vocabs, null, 2);
            updatePrefixList();
            updateResult();
        });

//        function updatePrefixList(){
//            const options = vocabs.map(function(vocab){
//                return `<option value="${vocab.prefix}">${vocab.prefix}</option>`;
//            });
//            propPrefix.innerHTML = options;
//        }

        const selectOption = (vocab) => `<option value="${vocab.prefix}">${vocab.prefix}</option>`;
        const updatePrefixList = () => {
            const options = vocabs.map(selectOption);
            propPrefix.innerHTML = options;
        }

        addProp.addEventListener("click", function(){
//            props.push({
//                prefix: propPrefix.value,
//                name: propName.value
//            });
            propList.innerText = JSON.stringify(props, null, 2);
            updateResult();
        });

        const vocabularyURI = (vocab) => `xmlns:${vocab.prefix}="${vocab.uri}"`;
        const propertyString = (prop) => `<${prop.prefix}:${prop.name}/>`;
        const updateResult = () => {
            const prefixes = vocabs.map(vocabularyURI).join("\n\t");
            const propsString = "\t" + props.map(propertyString).join("\n\t\t");
            const rdf = `
    <rdf:RDF
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns"
        ${prefixes}
    >
        <rdf:Description>
            ${propsString}

        </rdf:Description>
    </rdf>`;
            result.innerText = rdf;
        }
//http://jsbin.com/kazulumide/edit?js


        vocabs.push({
            uri: 'http://xmlns.com/foaf/0.1/',
            prefix: 'foaf'
        });
        vocabs.push({
            uri: 'http://purl.org/stuff/rev#',
            prefix: 'rev'
        });
        props.push({
            prefix: 'foaf',
            name: 'name'
        });
        props.push({
            prefix: 'rev',
            name: 'comment'
        });

        updateResult();





    }
()
)

