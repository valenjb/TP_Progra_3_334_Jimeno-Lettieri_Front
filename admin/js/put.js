const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorForm = document.getElementById("contenedor-form");
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
    contenedorProductos.innerHTML = `
        <ul>
            <li class="lista-producto">
                <img src="${producto.image}" alt="${producto.name}">
                <p>Id: ${producto.id} / Nombre: ${producto.name} / <strong>Precio: $${Number(producto.price).toLocaleString("es-AR")}</strong></p>
                <button type="button" id="updateProduct-button" class="boton-primario">Modificar producto</button>
            </li>
        </ul>
    `;

    const updateProductButton = document.getElementById("updateProduct-button");

    updateProductButton.addEventListener("click", event => {
        event.stopPropagation();
        mostrarFormulario(producto);
    });
}

function mostrarFormulario(producto) {
    contenedorForm.innerHTML = `
        <h3>Editando producto #${producto.id}</h3>

        <form id="updateProduct-form" class="form-admin">
            <input type="hidden" name="id" value="${producto.id}">

            <label for="nameProd">Nombre</label>
            <input type="text" name="name" id="nameProd" value="${producto.name}" required>

            <label for="descriptionProd">Descripción</label>
            <input type="text" name="description" id="descriptionProd" value="${producto.description || ""}">

            <label for="imageProd">Imagen (URL)</label>
            <input type="text" name="image" id="imageProd" value="${producto.image}" required>

            <label for="categoryProd">Categoría</label>
            <select name="category" id="categoryProd" required>
                <option value="hardware" ${producto.category === "hardware" ? "selected" : ""}>Hardware</option>
                <option value="software" ${producto.category === "software" ? "selected" : ""}>Software</option>
            </select>

            <label for="priceProd">Precio</label>
            <input type="number" name="price" id="priceProd" value="${producto.price}" required step="0.01">

            <button type="submit" class="boton-primario">Guardar cambios</button>
        </form>
    `;

    const updateProductForm = document.getElementById("updateProduct-form");

    updateProductForm.addEventListener("submit", async event => {
        event.preventDefault();

        const confirmacion = confirm("¿Querés guardar los cambios en este producto?");
        if (!confirmacion) {
            alert("Modificación cancelada");
            return;
        }

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        data.price = Number(data.price);

        const id = data.id;

        try {
            const response = await fetch(`${urlBase}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                contenedorForm.innerHTML = "";
                mostrarExito(result.message);
            } else {
                console.error("Error: ", result.message);
                mostrarError(result.message || "No se pudo modificar el producto");
            }

        } catch (error) {
            console.error("Error al modificar el producto: ", error);
            mostrarError("Ocurrió un error al modificar el producto");
        }
    });
}