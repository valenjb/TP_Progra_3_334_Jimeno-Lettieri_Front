// Maneja el cambio entre tema claro y oscuro
const TEMA_KEY = "LVTech_tema";

const track = document.getElementById("toggle-track");
const thumb = document.getElementById("toggle-thumb");
const toggle = document.getElementById("boton-tema");

function aplicarTema(tema) {
    document.documentElement.dataset.tema = tema;

    if (!track || !thumb || !toggle) return;

    if (tema === "oscuro") {
        thumb.textContent = "🌙";
        thumb.style.transform = "translateX(0)";
        track.style.background = "var(--primario)";
        toggle.checked = false;
    } else {
        thumb.textContent = "☀️";
        thumb.style.transform = "translateX(32px)";
        track.style.background = "#f0a500";
        toggle.checked = true;
    }
}

const temaGuardado = localStorage.getItem(TEMA_KEY) || "claro";
aplicarTema(temaGuardado);

toggle?.addEventListener("change", () => {
    const temaActual = document.documentElement.dataset.tema === "oscuro" ? "claro" : "oscuro";
    localStorage.setItem(TEMA_KEY, temaActual);
    aplicarTema(temaActual);
});