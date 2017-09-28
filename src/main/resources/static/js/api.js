(
    function(){

//        var recurso = {};
//        recurso.uri = 'Nome do recurso';
//
//        //Criando triplas
//        var triplas = {};
//        triplas.uri = 'http://xmlns.com/foaf/0.1/';
//        triplas.prefix = 'foaf';
//
//        //Criando pares (Propriedades + valores)
//        var par = [];
//        for(i = 0; i < 5; i++){
//            par.push({ prop: 'p' + i, value: 'v' + i });
//        }
//
//        //Vinculando pares e vocabulário
//        triplas.pares = par;
//
//        //Vinculando vocabulário e recursos
//        recurso.vocabularios = [];
//        recurso.vocabularios.push(triplas);
//
//        json_text = JSON.stringify(recurso);
//        console.log(recurso);
//        console.log(json_text);
//
//        const headers = new Headers();
//        headers.append('Content-Type', 'application/json');
//
//        fetch('/saveResource/process', {
//            method: 'POST',
//            headers,
//            body: json_text
//        }).then(function() {
//            console.log('ok');
//        });

        var recurso = {};
        recurso.about = 'http://teste.com/';
        recurso.vocabularies = [];


        vocab = {uri: 'http://xmlns.com/foaf/0.1/', prefix: 'foaf'}
        var pares = [];
        for(i = 0; i < 5; i++){
          pares.push({ propertyName: 'Propriedade FOAF' + i, value: 'Valor FOAF' + i });
        }
        vocab.pairs = pares;
        recurso.vocabularies.push(vocab);

        vocab = {uri: 'http://purl.org/stuff/rev#', prefix: 'rev'}
        pares = [];
        for(i = 0; i < 5; i++){
          pares.push({ propertyName: 'Propriedade REV' + i, value: 'Valor REV' + i });
        }
        vocab.pairs = pares;
        recurso.vocabularies.push(vocab);

        json_text = JSON.stringify(recurso);
        console.log(recurso);
        console.log(json_text);

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        fetch('/saveResource/process', {
            method: 'POST',
            headers,
            body: json_text
        }).then(function() {
            console.log('ok');
        });


}()
)