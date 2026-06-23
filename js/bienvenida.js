import { setCliente } from "./storage.js";

const formBienvenida = document.getElementById("form-bienvenida");

formBienvenida.addEventListener("submit", (event) => {
    event.preventDefault();

    const nombre = event.target.nombreCliente.value.trim();

    if (nombre.length < 2) {
        alert("Por favor ingresá tu nombre (al menos 2 letras)");
        return;
    }

    setCliente(nombre);
    window.location.href = "productos.html";
});
