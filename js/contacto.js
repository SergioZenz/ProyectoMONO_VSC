
// Fx de Validación de los CAMPOS del formulario
document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector(".formulario");

  function getErrorSpan(input) {
    // Siempre toma el span dentro del mismo .form-group
    return input.closest(".form-group").querySelector(".error-msg");
  }

  function setError(input, msg) {
    const span = getErrorSpan(input);
    input.classList.add("error");
    span.innerText = msg;
  }

  function clearError(input) {
    const span = getErrorSpan(input);
    input.classList.remove("error");
    span.innerText = "";
  }

  // Muestra un mensaje al enviar el form
function mostrarPopup() {
  const popup = document.getElementById("mi-popup");

  popup.classList.remove("hidden");

  // Reiniciar animación
  void popup.offsetWidth;

  popup.classList.add("show");

  // Mantener visible 5 segundos DESPUÉS de que terminó la animación popIn

  const tiempoAnimacionEntrada = 600;  // popIn dura 0.6s
  const tiempoVisible = 5000;

  setTimeout(() => {
    popup.classList.remove("show"); // saca clase show
    // esperar el fade-out antes de esconderlo del todo
    const tiempoFadeOut = 400; // depende del CSS
      
    setTimeout(() => {
       popup.classList.add("hidden");
    }, tiempoFadeOut);
    }, tiempoAnimacionEntrada + tiempoVisible);
  
  }

  form.addEventListener("submit", async function(event) {
    // Evita el envío hasta validar
    event.preventDefault();

    // Captura de campos
    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("apellido");
    const email = document.getElementById("email");
    const telefono = document.getElementById("telefono");
    const juegoFav = document.getElementById("juegofav");
    const radios = document.getElementsByName("mail-list");

    let valido = true;

    // Validaciones
    // nombre
    if (nombre.value.trim().length < 2) {
      setError(nombre, "El nombre debe contener al menos 2 caracteres.");
      valido = false;
    } else clearError(nombre);

    // apellido
    if (apellido.value.trim().length < 2) {
      setError(apellido, "El apellido debe contener al menos 2 caracteres.");
      valido = false;
    } else clearError(apellido);

    // email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      setError(email, "El formato del correo electrónico es inválido.");
      valido = false;
    } else clearError(email);

    // telefono

    const telRegex = /^[+\d][\d\s-]{6,20}$/;
    const tel = telefono.value.trim();

    if (tel.length < 7) {
        setError(telefono, "El teléfono debe contener al menos 7 dígitos.");
        valido = false;
    } else if (!telRegex.test(tel)) {
        setError(telefono, "Formato no válido (solo números y caracteres aceptados generalmente).");
        valido = false;
    }
    else {
        clearError(telefono);
    }

    // select del juego favorito
    if (juegoFav.value === "") {
      setError(juegoFav, "Debe seleccionar un juego.");
      valido = false;
    } else clearError(juegoFav);

    // radios para saber si desea que le lleguen e-mails
    let opcionElegida = false;
    for (const radio of radios) {
      if (radio.checked) {
        opcionElegida = true;
        break;
      }
    }

    if (!opcionElegida) {
    // el radios[0] es solo para ubicar el span de error dentro del form-group
      setError(radios[0], "Debe elegir una opción.");
      valido = false;
    } else {
      clearError(radios[0]);
    }

    // Si todo está correcto, se envía el formulario
    if (valido) {
      const formData = new FormData(form);
      
      try {
        const response = await fetch("https://formspree.io/f/mpwyaopd", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
       }
     }
   );

  if (response.ok) {
    // *** SI funca el envío ***
    form.reset();         // limpia el formulario
    mostrarPopup();       // popup estilo Monkey Island
    } else {
      // *** ERROR ***
      console.error("Error al enviar el formulario:", response.status);
      alert("Ocurrió un error al enviar el formulario.");
    }

  } catch (err) {
    console.error("Error en la conexión:", err);
    alert("Ocurrió un error de conexión.");
  }
}
});
});

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
    precioTotal.innerText = "Total: $" + totalPrice.toFixed(2);
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