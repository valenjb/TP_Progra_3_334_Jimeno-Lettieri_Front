import { API_URL } from "./config.js";
import { getCliente, getCarrito, setCarrito } from "./storage.js";

const contenedorProductos = document.getElementById("contenedor-productos");
const tabsCategoria = document.getElementById("tabs-categoria");
const paginacionEl = document.getElementById("paginacion");
const saludoCliente = document.getElementById("saludo-cliente");

const estado = {
    category: "",
    page: 1,
    limit: 8
};

saludoCliente.textContent = `Hola, ${getCliente()}, elegí tus productos`;

async function cargarProductos() {
    contenedorProductos.innerHTML = `<p class="mensaje-vacio">Cargando productos...</p>`;

    try {
        const params = new URLSearchParams();
        if (estado.category) params.append("category", estado.category);
        params.append("page", estado.page);
        params.append("limit", estado.limit);

        const response = await fetch(`${API_URL}/productos?${params.toString()}`);

        if (!response.ok) {
            throw new Error(`Error ${response.status} al obtener productos`);
        }

        const datos = await response.json();
        renderizarProductos(datos.payload);
        renderizarPaginacion(datos.pagination);

    } catch (error) {
        console.error("Error al cargar productos:", error);
        contenedorProductos.innerHTML = `<p class="mensaje-error">No se pudieron cargar los productos. ¿Está el servidor backend corriendo en el puerto 3000?</p>`;
        paginacionEl.innerHTML = "";
    }
}

function renderizarProductos(productos) {
    if (productos.length === 0) {
        contenedorProductos.innerHTML = `<p class="mensaje-vacio">No hay productos para este filtro.</p>`;
        return;
    }

    contenedorProductos.innerHTML = productos.map(producto => `
        <article class="card-producto" data-id="${producto.id}">
            <img src="${producto.image}" alt="${producto.name}">
            <h3>${producto.name}</h3>
            <p class="descripcion">${producto.description || ""}</p>
            <p class="precio mono">$${Number(producto.price).toLocaleString("es-AR")}</p>
            <div class="acciones-producto">
                <input type="number" class="cantidad-input" value="1" min="1" data-id="${producto.id}" aria-label="Cantidad">
                <button type="button" class="boton-agregar" data-id="${producto.id}">Agregar</button>
            </div>
        </article>
    `).join("");

    contenedorProductos.querySelectorAll(".boton-agregar").forEach(boton => {
        boton.addEventListener("click", () => agregarAlCarrito(boton.dataset.id, productos));
    });
}

function renderizarPaginacion(pagination) {
    const { page, totalPages } = pagination;

    if (totalPages <= 1) {
        paginacionEl.innerHTML = "";
        return;
    }

    let botones = "";
    for (let i = 1; i <= totalPages; i++) {
        botones += `<button type="button" class="boton-pagina ${i === page ? "activo" : ""}" data-page="${i}">${i}</button>`;
    }
    paginacionEl.innerHTML = botones;

    paginacionEl.querySelectorAll(".boton-pagina").forEach(boton => {
        boton.addEventListener("click", () => {
            estado.page = Number(boton.dataset.page);
            cargarProductos();
        });
    });
}

// Tabs de categoría (Todos / Hardware / Software)
tabsCategoria.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
        tabsCategoria.querySelectorAll(".tab").forEach(t => t.classList.remove("activo"));
        tab.classList.add("activo");
        estado.category = tab.dataset.categoria;
        estado.page = 1;
        cargarProductos();
    });
});

cargarProductos();
