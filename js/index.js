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
      item.image = item.image.replace("../",""); // Si está en index quita de la ruta de la imagen el "../"
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
    
    precioTotal.innerText = "Total: $" + totalPrice.toFixed(2);
    console.log(totalPrice)
    seccionFavs.appendChild(contenedorFavoritos);
    } catch (error) {
    console.error("Error al obtener los favoritos:", error);
  }
  if (localStorage.length < 1) {
    seccionFavs.style.display = "none"; // Linea que oculta el carrito al NO haber producto seleccionados
  }
  actualizarContador();
}

document.addEventListener("DOMContentLoaded", loadFavourites);

function eliminar(id) {
  let idx = id.toString();
  console.log(idx);
  localStorage.removeItem(idx);
  loadFavourites();
  const panel = document.getElementById("carrito-panel"); // 2 lineas agregadas para que no se cierre
  panel.style.display = "flex";                           // el carrito desp de eliminar 1 producto
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

function actualizarContador(){
  const total = localStorage.length;
  document.getElementById("item_cantidad").innerText = total > 0 ? total : "0";
}

