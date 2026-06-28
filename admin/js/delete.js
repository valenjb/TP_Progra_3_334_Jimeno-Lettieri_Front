const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form");
const urlBase = "http://localhost:3000/api/productos";

getProductForm.addEventListener("submit", async event => {
    event.preventDefault();

    const idProd = event.target.idProd.value.trim();

    if (!idProd) {
        mostrarError("Ingresá un id válido");
        return;
    }

    try {
        const response = await fetch(`${urlBase}/${idProd}`);
        const datos = await response.json();

        if (!response.ok) {
            mostrarError(datos.error || "No se encontró el producto");
            return;
        }

        renderizarProducto(datos.payload);

    } catch (error) {
        console.error("Error al obtener el producto: ", error);
        mostrarError("Ocurrió un error al consultar el producto");
    }
});

function mostrarError(mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-error">${mensaje}</p>
    `;
}

function mostrarExito(mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-exito">${mensaje}</p>
    `;
}

function renderizarProducto(producto) {
    // Dependiendo del estado actual del producto, mostramos el boton contrario
    const estaActivo = producto.active === 1;

    const botonAccion = estaActivo
        ? `<button type="button" id="accion-button" class="boton-primario" style="background: var(--peligro);">Desactivar producto</button>`
        : `<button type="button" id="accion-button" class="boton-primario">Reactivar producto</button>`;

    const estadoBadge = estaActivo
        ? `<span style="color: green;">● Activo</span>`
        : `<span style="color: red;">● Inactivo</span>`;

    contenedorProductos.innerHTML = `
        <ul>
            <li class="lista-producto">
                <img src="${producto.image}" alt="${producto.name}">
                <p>
                    Id: ${producto.id} /
                    Nombre: ${producto.name} /
                    <strong>Precio: $${Number(producto.price).toLocaleString("es-AR")}</strong> /
                    ${estadoBadge}
                </p>
                ${botonAccion}
            </li>
        </ul>
    `;

    const accionButton = document.getElementById("accion-button");

    accionButton.addEventListener("click", event => {
        event.stopPropagation();

        const accion = estaActivo ? "desactivar" : "activar";
        const confirmacion = confirm(`¿Querés ${accion} este producto?`);

        if (!confirmacion) {
            alert("Operación cancelada");
            return;
        }

        cambiarEstadoProducto(producto.id, accion);
    });
}

async function cambiarEstadoProducto(id, accion) {
    try {
        // Llamamos al endpoint correspondiente: /desactivar o /activar
        const response = await fetch(`${urlBase}/${id}/${accion}`, {
            method: "PATCH"
        });

        const result = await response.json();

        if (response.ok) {
            mostrarExito(result.message);
        } else {
            console.error("Error: ", result.message);
            mostrarError("No se pudo realizar la operación");
        }

    } catch (error) {
        console.error("Error: ", error);
        mostrarError("Ocurrió un error al cambiar el estado del producto");
    }
}