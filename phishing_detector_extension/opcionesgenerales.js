document.addEventListener("DOMContentLoaded", function () {
    // Inicializa los eventos al cargar la página
    document.getElementById("mode").addEventListener("change", toggleSections);
    document.getElementById("theme").addEventListener("change", toggleTheme);

    // Ejecuta las funciones al inicio para reflejar el estado guardado
    toggleSections();
    toggleTheme();
});

function toggleSections() {
    var mode = document.getElementById("mode").value.trim();
    var advancedSections = document.querySelectorAll(".advanced");
    console.log("Modo seleccionado:", mode);

    if (mode === "Básico") {
        advancedSections.forEach(function (section) {
            section.style.display = "none";
        });
    } else {
        advancedSections.forEach(function (section) {
            section.style.display = "block";
        });
    }
}

function toggleTheme() {
    var theme = document.getElementById("theme").value.trim();
    var body = document.body;
    console.log("Tema seleccionado:", theme);
    
    if (theme === "Oscuro") {
        body.classList.add("dark-mode");
    } else {
        body.classList.remove("dark-mode");
    }
}

document.querySelector('.icon-button[data-action="sugerenciasManejo"]').addEventListener('click', function() {
    const pdfUrl = './pdfs/DocumentoSugerencia.pdf'; // Ruta relativa al archivo PDF
    window.open(pdfUrl, '_blank'); // Abre el PDF en una nueva pestaña
});