import { API_URL } from "./config.js";
import { getCliente, getCarrito, setCarrito, clearCarrito } from "./storage.js";

const contenedorCarrito = document.getElementById("contenedor-carrito");
const totalCarritoEl = document.getElementById("total-carrito");
const botonConfirmar = document.getElementById("boton-confirmar");
const modal = document.getElementById("modal-confirmar");
const modalTotal = document.getElementById("modal-total");
const modalCancelar = document.getElementById("modal-cancelar");
const modalAceptar = document.getElementById("modal-aceptar");

function renderizarCarrito() {
    const carrito = getCarrito();

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `<p class="mensaje-vacio">Tu carrito está vacío. <a href="productos.html">Ver productos</a></p>`;
        totalCarritoEl.textContent = "$0";
        botonConfirmar.disabled = true;
        return;
    }

    botonConfirmar.disabled = false;

    contenedorCarrito.innerHTML = carrito.map(item => `
        <div class="item-carrito" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="info-item">
                <p class="nombre-item">${item.name}</p>
                <p class="precio-item">$${item.price.toLocaleString("es-AR")} c/u</p>
            </div>
            <div class="cantidad-controles">
                <button type="button" class="restar" data-id="${item.id}" aria-label="Quitar uno">-</button>
                <span>${item.quantity}</span>
                <button type="button" class="sumar" data-id="${item.id}" aria-label="Agregar uno">+</button>
            </div>
            <p class="subtotal-item">$${(item.price * item.quantity).toLocaleString("es-AR")}</p>
            <button type="button" class="boton-quitar" data-id="${item.id}">Quitar</button>
        </div>
    `).join("");

    const total = carrito.reduce((acc, item) => acc + item.price * item.quantity, 0);
    totalCarritoEl.textContent = `$${total.toLocaleString("es-AR")}`;

    contenedorCarrito.querySelectorAll(".sumar").forEach(boton => {
        boton.addEventListener("click", () => cambiarCantidad(boton.dataset.id, 1));
    });
    contenedorCarrito.querySelectorAll(".restar").forEach(boton => {
        boton.addEventListener("click", () => cambiarCantidad(boton.dataset.id, -1));
    });
    contenedorCarrito.querySelectorAll(".boton-quitar").forEach(boton => {
        boton.addEventListener("click", () => quitarDelCarrito(boton.dataset.id));
    });
}

function cambiarCantidad(id, delta) {
    const carrito = getCarrito();
    const item = carrito.find(p => String(p.id) === String(id));
    if (!item) return;

    item.quantity += delta;

    const nuevoCarrito = item.quantity <= 0
        ? carrito.filter(p => String(p.id) !== String(id))
        : carrito;

    setCarrito(nuevoCarrito);
    renderizarCarrito();
}

function quitarDelCarrito(id) {
    const carrito = getCarrito().filter(p => String(p.id) !== String(id));
    setCarrito(carrito);
    renderizarCarrito();
}

botonConfirmar.addEventListener("click", () => {
    const carrito = getCarrito();
    const total = carrito.reduce((acc, item) => acc + item.price * item.quantity, 0);
    modalTotal.textContent = `$${total.toLocaleString("es-AR")}`;
    modal.classList.remove("oculto");
});

modalCancelar.addEventListener("click", () => {
    modal.classList.add("oculto");
});

modalAceptar.addEventListener("click", async () => {
    modal.classList.add("oculto");

    const carrito = getCarrito();
    const cliente = getCliente();

    try {
        const response = await fetch(`${API_URL}/ventas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_name: cliente,
                items: carrito.map(item => ({ producto_id: item.id, quantity: item.quantity }))
            })
        });

        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(resultado.message || (resultado.errores && resultado.errores.join(", ")) || "No se pudo registrar la venta");
        }

        // El ticket vive solo durante esta sesión del navegador
        sessionStorage.setItem("LVTech_ultima_venta", JSON.stringify(resultado.payload));
        clearCarrito();
        window.location.href = "ticket.html";

    } catch (error) {
        console.error("Error al confirmar la compra:", error);
        alert(`Ocurrió un error al confirmar la compra: ${error.message}`);
    }
});

renderizarCarrito();
