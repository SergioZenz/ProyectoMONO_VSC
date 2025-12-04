
//Función que toma los objetos del archivo productos.json
async function cargarProductos() {
  try {
    const respuesta = await fetch("../json/productos.json");
    
    if (!respuesta.ok) {
      throw new Error("No se pudo cargar el archivo JSON");
    }

    const productosjson = await respuesta.json();
    return productosjson;

  } catch (error) {
    console.error("Error al cargar los productos:", error);
    return [];
  }
}

// Pasos para agregar los productos al HTML
document.addEventListener("DOMContentLoaded", async () => {

//Carga los objetos en una variable
const productos = await cargarProductos();
//Imprime por consola el contenido
console.log(productos)

//Variable para seleccionar la section de productos del html
let productosContainer = document.getElementById('productos');

//Se crea un contenedor general para los productos
let contenedorProducto = document.createElement('div');

//Se agrega una clase/estilo CSS al contenedor de los productos
contenedorProducto.classList.add('prod-container');

//Carga de productos

  productos.forEach(producto => {

    
    let objToPass = {
      id : producto.id,
      name : producto.name,
      price : producto.price,
      image : producto.image,
      desc : producto.desc,
      description : producto.description,
      }      
    
    let cadena = JSON.stringify(objToPass);

    // Reemplacé el """ contenedorProducto.innerHTML += ` """ por el siguiente para que se carguen más rápido los productos
    contenedorProducto.insertAdjacentHTML('beforeend', ` 
      <div class="prod-item">
          <div class="item-tit" id="nombre" name="nombre">${producto.name}</div>
          <br>
          <div class="item-img" id="imagen" name="imagen">
            <img class="imagen-card" src="${producto.image}"></img>
          </div>
          <br>
          <div class="datos">
            <span class="precio" id="precio" name="precio">$${producto.price}</span>
            <span class="off" id="descuento" name="descuento">${producto.desc}% OFF</span><br>
            <div id="description${producto.id}" class="description">
                  ${producto.description}
            </div><br>
          </div>
          <div class="botonera" id="botonera${producto.id}">
            <button onclick='addWishList(${cadena})' value="Comprar" class="btn-agregar"><i class="fa-brands fa-steam"></i> Agregar</button>
          </div>
      </div>
    `);
    productosContainer.append(contenedorProducto);
  });
});


// ACA EMPIEZA EL CODIGO DE EJEMPLO

//función que arma un objeto nuevo , que tiene los atributos


function addWishList(data) {
  console.log("Se agregó dentro del carrito con addWishList");
  console.log(data.name);
  console.log(data.id); //id: id del objeto del .jon
  console.log(data.price);
  console.log(data.image);
  console.log(data);
  //console.log("Producto: "+ JSON.parse(productoId));
  const prodToAdd = {
    "id": data.id,
    "favId": Date.now(), //favId: id único que sirve de key para interactuar con LocalStorage
    "name" : data.name,
    "image": data.image,
    "price": data.price,
    "desc": data.desc,
    "description": data.description,
  }

  //LocalStorage
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem(prodToAdd.favId, JSON.stringify(prodToAdd));
    loadFavourites();
  }
  return false;
}

//Creo un div contenedor para los favoritos y le agrego una clase 
const contenedorFavoritos = document.createElement('div');
contenedorFavoritos.classList.add('contenedor-favoritos');

let seccionFavs = document.getElementById("seccion_favs");

let tituloCarrito = document.getElementById('titulo_favs');

let totalFavoritos = document.getElementById('item_cantidad');

let precioTotal = document.getElementById('precio_total');

function loadFavourites() {
  try {
    contenedorFavoritos.innerHTML = ""; // línea para evitar duplicados

    let totalPrice = 0;

    if(localStorage.length > 0) {
      seccionFavs.style.display = "block";
      document.getElementById("carrito-panel").style.display = "none"; // inicio oculto
      totalFavoritos.textContent = localStorage.length; // actualiza el número en el ícono
      totalFavoritos.innerText = localStorage.length;
    }
    Object.keys(localStorage).forEach(function(key) {
      let item = JSON.parse(localStorage.getItem(key));
      totalPrice += item.price;
      contenedorFavoritos.innerHTML += `
            <div class="card-fav">
              <img id="imagen" src="${item.image}"></img>
              <h5>${item.price} $</h5>
              <h5>${item.name}</h5>
              <div>
                <button onclick="eliminar(${item.favId})" class="btn-del" value="Eliminar">Eliminar ❌</button>
              </div>
            </div>
        `;
    });
    precioTotal.innerText = 'Total : '.concat(totalPrice).concat(' $');
    seccionFavs.appendChild(contenedorFavoritos);
    } catch (error) {
    console.error("Error al obtener los favoritos:", error);
  }
  if (localStorage.length < 1) {
    seccionFavs.style.display = "none"; // Linea que oculta el carrito al NO haber producto seleccionados
  }
}

document.addEventListener("DOMContentLoaded", loadFavourites);

function eliminar(id) {
  let idx = id.toString();
  console.log(idx);
  localStorage.removeItem(idx);
  loadFavourites();
}

//boton deleteAll del html que elimina todos los favoritos.
const btnDeleteAll = document.getElementById('delete_all');
btnDeleteAll.addEventListener('click', eliminarDeseados);

async function eliminarDeseados() {
  try {
    localStorage.clear();
    loadFavourites();
  } catch(error) {
    console.log(error);
  }
}

// Toggle del carrito
document.getElementById("carrito-icono").addEventListener("click", () => {
  const panel = document.getElementById("carrito-panel");
  panel.style.display = (panel.style.display === "flex") ? "none" : "flex";
});

