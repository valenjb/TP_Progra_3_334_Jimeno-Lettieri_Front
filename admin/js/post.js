const postProductForm = document.getElementById("postProduct-form");
const contenedorMensaje = document.getElementById("contenedor-mensaje");
const urlBase = "http://localhost:3000/api/productos";

function validarFormulario(data) {
    const errores = [];

    if (!data.name || data.name.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    if (!data.image || data.image.trim().length === 0) {
        errores.push("La imagen es obligatoria");
    }

    if (!data.category) {
        errores.push("Debe seleccionar una categoría");
    }

    if (!data.price || isNaN(data.price) || Number(data.price) <= 0) {
        errores.push("El precio debe ser un número mayor a 0");
    }

    return errores;
}

function mostrarMensaje(tipo, mensaje) {
    contenedorMensaje.innerHTML = `
        <p class="mensaje mensaje-${tipo}">${mensaje}</p>
    `;
}

postProductForm.addEventListener("submit", async event => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Convertimos price a numero antes de enviarlo
    data.price = Number(data.price);

    const errores = validarFormulario(data);
    if (errores.length > 0) {
        mostrarMensaje("error", errores.join(" / "));
        return;
    }

    try {
        const response = await fetch(urlBase, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            mostrarMensaje("error", result.message || "No se pudo crear el producto");
            return;
        }

        mostrarMensaje("exito", result.message);
        postProductForm.reset();

    } catch (error) {
        console.error("Error al crear el producto: ", error);
        mostrarMensaje("error", "Ocurrió un error al crear el producto");
    }
});