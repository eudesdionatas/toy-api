const listPlaces = document.getElementById("listPlaces");

function renderPlace(place){
    return `
        <tr>
            <td>${place.placeName}</td>
            <td>${place.comment}</td>
            <td>${place.rate}</td>
            <td>${place.latitude}</td>
            <td>${place.longitude}</td>
        </tr>
    `;
}

function renderPlaces(){

    fetch('/places')
        .then(function(data){
            return data.json();
            console.log(data);
        })
        .then(function(places){
            console.log(places);
            const tbody = listPlaces.querySelector('tbody');
            let trs = '';
            for(let place of places){
                trs += renderPlace(place);
            }
            tbody.innerHTML = trs;
        });
}

window.onload =  renderPlaces;

const form = document.getElementById("placeForm");
form.onsubmit = function(evt) {
    // Esta linha evita aconteça o comportamento padrão depois da requisição
    // Por exemplo: Impedir que um botão de envio envie um formulário
    evt.preventDefault();

    const el = form.elements;

    const place = {
        comment: el.comment.value,
        rate: el.rate.value,
        placeName: el.placeName.value,
        latitude: el.latitude.value,
        longitude: el.longitude.value
    };
    console.log(place);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    fetch('/places', {
        method: 'POST',
        headers,
        body: JSON.stringify(place)
    }).then(function() {
        form.reset();

        renderPlaces();
    });
}