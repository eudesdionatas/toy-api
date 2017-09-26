const modelForm = document.getElementById("modelForm");
const buttonAddVocabulary = document.getElementById("addVocab");
const buttonAddProperty = document.getElementById("addPropertyBtn");

buttonAddVocabulary.addEventListener('click', addVocabulary);

function addVocabulary(evt){
    evt.preventDefault();
    var row = getRowVocabulary();
    document.getElementById("headerModel").insertAdjacentHTML("beforeend",row);
}


function getRowVocabulary(){
    const el = modelForm.elements;
    var row = `&emsp;<a onclick="addInputProperty()" href="#">xmlns:${el.prefix.value}=${el.uri.value}</a><br/>`;
    return row;
}


function addInputProperty(){
    var row = getRowVocabulary();
    var input =  `<input type="text"/>`;
    row.innerHTML += input;

}


