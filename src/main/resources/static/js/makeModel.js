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
            vocabs.push({
                uri: uri.value,
                prefix: prefix.value
            });
            vocabList.innerText = JSON.stringify(vocabs, null, 2);
            updatePrefixList();
            updateResult();
        });

        function updatePrefixList(){
            cont options = vocabs.map(function(vocab){
                return `<option value="${vocab.prefix}">${vocab.prefix}</option>`;
            });
            propPrefix.innerHTML = options;
        }

//        const renderOption = ({prefix}) => `<option value="${prefix}">${prefix}</option>`
//        const updatePrefixList = () => {
//            const options = vocabs.map(renderOption);
//            propPrefix.innerHTML = options;
//        }

        addProp.addEventListener("click", function(){
            props.push({
                prefix: propPrefix.value,
                name: propName.value
            })
            propList.innerText = JSON.stringify(props, null, 2);
            updateResult();
        });

        function updateResult(){
//            const prefixes = vocabs.map(function(vocab){
//                return `xmlns:${vocab}`
//            })
//http://jsbin.com/kazulumide/edit?js
        }

    }
()
)

