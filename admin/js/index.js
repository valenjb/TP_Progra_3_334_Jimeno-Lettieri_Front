const contenedorProductos = document.getElementById("contenedor-productos");
const urlBase = "http://localhost:3000/api/productos";

async function mostrarProductos() {
    try {
        // Con ?all=true traemos tambien los productos inactivos
        const response = await fetch(`${urlBase}?all=true&limit=100`);
        const datos = await response.json();

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const productos = datos.payload;
        renderizarProductos(productos);

    } catch (error) {
        console.error("Error al cargar productos: ", error);
        contenedorProductos.innerHTML = `
            <p class="mensaje-error">Error al cargar los productos. ¿Está corriendo el backend?</p>
        `;
    }
}

function renderizarProductos(productos) {
    let htmlProductos = "";

    productos.forEach(producto => {
        // Si el producto está inactivo lo marcamos visualmente
        const estadoBadge = producto.active
            ? `<span style="color: green;">● Activo</span>`
            : `<span style="color: red;">● Inactivo</span>`;

        htmlProductos += `
            <article class="card-producto">
                <img src="${producto.image}" alt="${producto.name}">
                <span class="etiqueta-subcategoria">${producto.category}</span>
                <h3>${producto.name}</h3>
                <p class="descripcion">ID: ${producto.id}</p>
                <p class="descripcion">${producto.description || ""}</p>
                <p class="precio mono">$${Number(producto.price).toLocaleString("es-AR")}</p>
                <p>${estadoBadge}</p>
            </article>
        `;
    });

    contenedorProductos.innerHTML = htmlProductos;
}

mostrarProductos();