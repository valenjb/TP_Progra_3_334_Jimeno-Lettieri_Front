import { clearCliente, clearCarrito } from "./storage.js";

const contenedorTicket = document.getElementById("contenedor-ticket");
const botonReiniciar = document.getElementById("boton-reiniciar");
const botonPdf = document.getElementById("boton-pdf");

const ventaGuardada = sessionStorage.getItem("LVTech_ultima_venta");

if (!ventaGuardada) {
    // No hay ninguna compra reciente para mostrar: no tiene sentido estar acá
    window.location.href = "index.html";
} else {
    const venta = JSON.parse(ventaGuardada);
    renderizarTicket(venta);
}

function renderizarTicket(venta) {
    const fecha = new Date().toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    const filas = venta.productos.map(p => `
        <tr>
            <td>${p.name || `Producto #${p.producto_id}`}</td>
            <td>${p.quantity}</td>
            <td>$${Number(p.unit_price).toLocaleString("es-AR")}</td>
            <td>$${(p.quantity * Number(p.unit_price)).toLocaleString("es-AR")}</td>
        </tr>
    `).join("");

    contenedorTicket.innerHTML = `
        <h2>LVTech</h2>
        <p class="ticket-meta">Cliente: <strong>${venta.client_name}</strong></p>
        <p class="ticket-meta">Fecha: ${fecha}</p>
        <table class="tabla-ticket">
            <thead>
                <tr><th>Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr>
            </thead>
            <tbody>${filas}</tbody>
        </table>
        <p class="ticket-total mono">Total: $${Number(venta.total).toLocaleString("es-AR")}</p>
        <p class="ticket-gracias">¡Gracias por tu compra, ${venta.client_name}!</p>
    `;
}

botonReiniciar.addEventListener("click", () => {
    sessionStorage.removeItem("LVTech_ultima_venta");
    clearCarrito();
    clearCliente();
    window.location.href = "index.html";
});

botonPdf.addEventListener("click", () => {
    const venta = JSON.parse(sessionStorage.getItem("LVTech_ultima_venta"));

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 10;

    doc.setFontSize(18);
    doc.text("LVTech - Ticket de compra", 10, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Cliente: ${venta.client_name}`, 10, y);
    y += 7;

    const fecha = new Date().toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    doc.text(`Fecha: ${fecha}`, 10, y);
    y += 10;

    venta.productos.forEach(p => {
        doc.text(`${p.name} x${p.quantity} - $${Number(p.unit_price).toLocaleString("es-AR")}`, 10, y);
        y += 7;
    });

    y += 5;
    doc.text(`Total: $${Number(venta.total).toLocaleString("es-AR")}`, 10, y);

    doc.save(`LVTech-ticket-${venta.client_name}.pdf`);
});