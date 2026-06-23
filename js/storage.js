const KEY_CLIENTE = "LVTech_cliente";
const KEY_CARRITO = "LVTech_carrito";

export function getCliente() {
    return localStorage.getItem(KEY_CLIENTE);
}

export function setCliente(nombre) {
    localStorage.setItem(KEY_CLIENTE, nombre);
}

export function clearCliente() {
    localStorage.removeItem(KEY_CLIENTE);
}

export function getCarrito() {
    const data = localStorage.getItem(KEY_CARRITO);
    return data ? JSON.parse(data) : [];
}

export function setCarrito(carrito) {
    localStorage.setItem(KEY_CARRITO, JSON.stringify(carrito));
}

export function clearCarrito() {
    localStorage.removeItem(KEY_CARRITO);
}
