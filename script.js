const urlBase = 'https://jsonplaceholder.typicode.com/posts' // esta es la URL con la que interactuaremos
let posts = [] // iniciamos los posteos como un array vacío

function getData() {
    fetch(urlBase)
        .then(res => res.json())
        .then(data => {
            posts = data
            renderPostList()
        })
        .catch(error => console.error('Error al llamar a la API: ', error))
}

getData()


function renderPostList() { //Esta función hace que se renderice la lista cada vez que hacemos un cambio o sumamos un item nuevo.
    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.forEach(post => {
        const listItem = document.createElement('li'); //Acá creamos una lista ordenada, dentro de la lista UL del index.
        listItem.classList.add('postItem'); //Acá creamos en nombre de cada articulo para editar luego en CSS.
        //Acá creamos la estructura de cada item dentro de la lista, usando html dentro del script.
        listItem.innerHTML = `
        
        <strong>${post.title}</strong>
        <p>${post.body}</p>
        <button onclick="editPost(${post.id})">Editar</button>
        <button onclick="deletePost(${post.id})">Borrar</button>

        <div id="editForm-${post.id}" class="editForm" style="display:none">
            <label for="editTitle">Título: </label>
            <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
            <label for="editBody"> Comentario: </label>
            <textarea id="editBody-${post.id}" required>${post.body}</textarea>
            <button onclick="updatePost(${post.id})"> Actualizar </button>
        </div>
        `
        postList.appendChild(listItem) //Acá agregamos cada item a la lista de items que se vera reflejada en la web.
    })
}

function postData() {   //Creamos la función que está en el index.

    const postTitleInput = document.getElementById('postTitle'); //Se pasa primero la información a una viariable y luego de esa variable lo pasamos con .value a la variable que vamos a trabajar en el fetch
    const postBodyInput = document.getElementById('postBody'); //Acá igual
    const postTitle = postTitleInput.value; // Esto lo hacemos para que no quede grabado en un nuevo posteo la misma información en pantalla.
    const postBody = postBodyInput.value; //Luego en las líneas 71 y 72 borramos las variables postTitleInput y postBobyInput y esto hace que se borre la información en un nuevo posteo.

    if (postTitle.trim() == '' || postBody.trim() == '') {
        alert('Los campos son obligatorios')
        return
    }

    fetch(urlBase, {    //Este fetch lo treamos de la API de la web en su documentación. En Guide y luego en Creating a resource.
        method: 'POST',
        body: JSON.stringify({
            title: postTitle, // Se edita este dato con la variable creada en la línea 48
            body: postBody, // Se edita este dato con la variable creada en la línea 49
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })  // hasta acá se copia de la web de la API.
        .then(res => res.json())
        .then(data => {
            posts.unshift(data) //Esto en un PUSH, pero que coloca el nuevo item al array, pero al principio de todo, como una pila.
            renderPostList();
            postTitleInput.value = ''
            postBodyInput.value = ''
        })
        .catch(error => console.error('Error al querer crear posteo: ', error)) // Acá mostramos este erro por pantalla en caso de no cumplir los then
}

function editPost(id) {  //Desde acá laburamos las funciones creadas en el html dentro del script.
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none' //Acá validamos que si editForm esta en none, se pase a block y si no es none, se pase a none.
}

function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    fetch(`${urlBase}/${id}`, {  //Este parte tambíen debemos tomarla de la libreria de la API de la WEB en Guide y en Updating a resourse
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: editTitle, // Se edita este dato con la variable de la línea 83
            body: editBody, // Se edita este dato con la variable de la línea 84
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }, // Se copia hasta acá.
    })
        .then(res => res.json())
        .then(data => {
            const index = posts.findIndex(post => post.id === data.id)  // Acá buscamos el index de nuestro posteo del que vamos a actualizar.
            if (index != -1) { // Si no da -1 lo editamos.
                posts[index] = data
            } else {
                alert('Hubo un error al actualizar la información del posteo') // Sino, tiramos este error por pantalla URL
            }
            renderPostList()
        })
        .catch(error => console.error('Error al querer actualizar posteo: ', error)) // Acá mostramos este erro por pantalla en caso de no cumplir los then
}

function deletePost(id) {
    fetch(`${urlBase}/${id}`, {
        method: 'DELETE',  // Acá también revisamos la documentación de la API wed y buscamos Delting a resource
    })
    .then(res => {
        if(res.ok){
            posts = posts.filter(post => post.id != id) // Acá guardamos todos los posteos que no coincidan con la ID borrada.
            renderPostList(); // Y renderizamos la lista que nos queda.
        } else{
            alert('Hubo un error y no se pudo eliminar el posteo') // En el caso de que no sea ok el número de ID
        }
    })
    .catch(error => console.error('Hubo un error: ', error))  // Acá mostramos este error por pantalla en caso de no cumplir los then
}