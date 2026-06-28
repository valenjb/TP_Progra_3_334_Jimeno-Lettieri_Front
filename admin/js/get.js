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

        const producto = datos.payload;
        renderizarProducto(producto);

    } catch (error) {
        console.error("Error al obtener el producto: ", error);
        mostrarError("Ocurrió un error al consultar el producto");
    }
});

function renderizarProducto(producto) {
    const estadoBadge = producto.active
        ? `<span style="color: green;">● Activo</span>`
        : `<span style="color: red;">● Inactivo</span>`;

    contenedorProductos.innerHTML = `
        <ul>
            <li class="lista-producto">
                <img src="${producto.image}" alt="${producto.name}">
                <p>
                    Id: ${producto.id} /
                    Nombre: ${producto.name} /
                    Categoría: ${producto.category} /
                    <strong>Precio: $${Number(producto.price).toLocaleString("es-AR")}</strong> /
                    ${estadoBadge}
                </p>
            </li>
        </ul>
    `;
}

function mostrarError(mensaje) {
    contenedorProductos.innerHTML = `
        <p class="mensaje mensaje-error">${mensaje}</p>
    `;
}