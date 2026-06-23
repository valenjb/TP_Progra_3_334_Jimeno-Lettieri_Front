// Actualiza el numerito (badge) del carrito en la barra de navegacion,
// se importa en todas las paginas para que el contador siempre este al dia.
import { getCarrito } from "./storage.js";

function actualizarContador() {
    const carrito = getCarrito();
    const totalItems = carrito.reduce((acc, item) => acc + item.quantity, 0);
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        contador.textContent = totalItems;
    }
}

actualizarContador();
