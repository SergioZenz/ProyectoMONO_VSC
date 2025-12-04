// ---------- LOGIN POPUP ----------
const modalLogin = document.getElementById("modalLogin");
const btnLogin = document.getElementById("btn-login");
const closeLogin = document.getElementById("closeLogin");
const formLogin = document.getElementById("loginForm");

// abrir modal
btnLogin.addEventListener("click", () => {
  modalLogin.style.display = "flex";
});

// cerrar modal
closeLogin.addEventListener("click", () => {
  modalLogin.style.display = "none";
});

// cerrar haciendo click fuera
window.addEventListener("click", e => {
  if(e.target === modalLogin) modalLogin.style.display = "none";
});

// login validacion
formLogin.addEventListener("submit", async e =>{
  e.preventDefault();
  const userInput = document.getElementById("username").value.trim();
  const passInput = document.getElementById("password").value.trim();

  const usuarios = await cargarUsuarios();

  // Buscar coincidencia
  const usuarioValido = usuarios.find(u => u.user === userInput && u.pass === passInput);

  if(usuarioValido){
      alert(`Bienvenido ${usuarioValido.nombre || usuarioValido.user} 🏴‍☠️`);
      sessionStorage.setItem("sessionUser", JSON.stringify(usuarioValido));
      modalLogin.style.display = "none";
  } else {
      alert("❌ Usuario o contraseña incorrectos");
  }
 
});

async function cargarUsuarios() {
  try {
    let res;

    if (location.pathname.includes("index.html")) {
    res = await fetch("./json/usuarios.json");
} else {
    res = await fetch("../json/usuarios.json");
}

    if (!res.ok) throw new Error("No se pudo cargar usuarios.json");
    return await res.json();
  } catch (e) {
    console.error("Error cargando usuarios:", e);
    return [];
  }
}

const session = JSON.parse(sessionStorageStorage.getItem("sessionUser"));

// Todavía no está ACTIVO
if(session){
    document.getElementById("btn-login").innerHTML = `<i class="fa-solid fa-user"></i> ${session.user}`;
}