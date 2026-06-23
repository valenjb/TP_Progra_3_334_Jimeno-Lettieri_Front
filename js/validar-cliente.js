import { getCliente } from "./storage.js";

if (!getCliente()) {
    window.location.href = "index.html";
}
