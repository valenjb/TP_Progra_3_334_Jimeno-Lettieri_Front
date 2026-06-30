// Maneja el cambio entre tema claro y oscuro
const TEMA_KEY = "LVTech_tema";

function aplicarTema(tema) {
    document.body.dataset.tema = tema;
    const boton = document.getElementById("boton-tema");
    if (boton) {
        boton.textContent = tema === "oscuro" ? "☀️" : "🌙";
    }
}

const temaGuardado = localStorage.getItem(TEMA_KEY) || "claro";
aplicarTema(temaGuardado);

document.getElementById("boton-tema")?.addEventListener("click", () => {
    const temaActual = document.body.dataset.tema === "oscuro" ? "claro" : "oscuro";
    localStorage.setItem(TEMA_KEY, temaActual);
    aplicarTema(temaActual);
});
