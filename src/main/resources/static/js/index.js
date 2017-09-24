 const list = document.getElementById('list');

function renderMovie(movie) {
    return `
        <tr>
            <td>${movie.title}</td>
            <td>${movie.genre}</td>
            <td>${movie.year}</td>
        </tr>
    `;
}

function render() {
    fetch('/movies')
        .then(function(data) {
            return data.json();
        })
        .then(function(movies) {
            console.log(movies);
            const tbody = list.querySelector('tbody');
            let trs = ''
            for (let movie of movies) {
                trs += renderMovie(movie);
            }
            tbody.innerHTML = trs;
        });
}

window.onload = render;


const form = document.getElementById("movieForm");
form.onsubmit = function(evt) {
    evt.preventDefault();
    const el = form.elements;

    const movie = {
        title: el.title.value,
        genre: el.genre.value,
        year: el.year.value
    };

    console.log(movie);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    fetch('/movies', {
        method: 'POST',
        headers,
        body: JSON.stringify(movie)
    }).then(function() {
        console.log('ok');
        form.reset();
        render();
    });
}