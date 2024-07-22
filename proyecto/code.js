const url = 'http://localhost:3000/api/articulos/';
const contenedor = document.querySelector('tbody');
let resultados = '';

const modalArticulo = new bootstrap.Modal(document.getElementById('modalArticulo'));
const formArticulo = document.querySelector('form');
const descripción = document.getElementById('Descripción');
const precio = document.getElementById('Precio');
const stock = document.getElementById('Stock');
let opcion = '';

btnCrear.addEventListener('click', () => {
    descripción.value = '';
    precio.value = '';
    stock.value = '';
    modalArticulo.show();
    opcion = 'Crear';
});

// Función para mostrar los resultados
const mostrar = (articulos) => {
    resultados = ''; // Reiniciar resultados para evitar acumulaciones
    articulos.forEach(articulo => { 
        resultados += `
        <tr>
               <td>${articulo.id}</td> 
               <td>${articulo.descripcion}</td>
               <td>${articulo.precio}</td>
               <td>${articulo.stock}</td>
               <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
        </tr>
        `;
    });
    contenedor.innerHTML = resultados;
};

// Procedimiento Mostrar
fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => mostrar(data))
    .catch(error => {
        console.log('Fetch error:', error);
        alert('Error al conectar con el servidor. Por favor, inténtalo de nuevo más tarde.');
    });


const on = (element, event, selector, handler) => {
    element.addEventListener( event, e => {
        if(e.target.closest(selector)){
            handler(e);
        }
    })
}    

on(document, 'click', '.btnBorrar', e =>{
    const fila = e.target.parentNode.parentNode;
    const id = fila.firstElementChild.innerHTML;
    alertify.confirm("¿Estas seguro que quieres borrar el elemento " + id + "?",
        function(){
            fetch(url+id,{
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(() => location.reload())
        },
        function(){
          alertify.error('Cancelado');
        })
    })

let idform = 0 ;
on(document, 'click', '.btnEditar', e => {
    console.log('Editado')
    const fila = e.target.parentNode.parentNode;
    idform = fila.children[0].innerHTML;
    const descripcionForm = fila.children[1].innerHTML;
    const precioForm = fila.children[2].innerHTML;
    const stockForm = fila.children[3].innerHTML;
    descripción.value = descripcionForm;
    precio.value = precioForm;
    stock.value = stockForm;
    opcion = 'editar';
    modalArticulo.show();
})    

formArticulo.addEventListener('submit', (e) => {
    e.preventDefault();
    if(opcion == 'Crear'){
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                descripcion:descripción.value,
                precio:precio.value,
                stock:stock.value
            })
        })
            .then( response => response.json() )
            .then(data => {
                const nuevoArticulo = []
                nuevoArticulo.push(data);
                mostrar(nuevoArticulo);
        })
    } 
    if(opcion == 'editar'){
        fetch(url + idform, {
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                descripcion:descripción.value,
                precio:precio.value,
                stock:stock.value
            })
        })        
        .then( response => response.json() )
        .then( () => location.reload())
    } 
    modalArticulo.hide()
})