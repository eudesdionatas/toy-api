const modelForm = document.getElementById("modelForm");

var buttonAddVocabulary = document.getElementById("addVocabulary");
//buttonAddVocabulary.onClick =
function addVocabulary(){
    const el = modelForm.elements;
    var uri = `${el.uri.value}<br/>`;
    document.getElementById("model").insertAdjacentHTML("beforeend",uri)
    //document.getElementById("modelForm").innerHTML += uri;
    modelForm.reset();

}


