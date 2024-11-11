var enlacesGuardados = [];
var sospechosoDetectado = 0; // Indicador de enlace sospechoso
var enCorreo = false; // Variable para verificar si estamos en un contexto de correo

console.log("Content script cargado");

// Función para analizar los enlaces en el correo actual
function analizarEnlaces() {
    // Limpiamos los enlaces guardados y los indicadores
    enlacesGuardados.length = 0;
    sospechosoDetectado = 0;
    enCorreo = false;

    // Verificamos si estamos en un contexto de correo
    const correoContent = document.querySelector('div[role="document"]');
    if (correoContent) {
        enCorreo = true;

        // Obtenemos todos los enlaces en el correo
        enlacesGuardados.push(...Array.from(correoContent.querySelectorAll('a')).map(link => link.href));
    }

    console.log("Enlaces encontrados:", enlacesGuardados); // Muestra el valor actual de enlacesGuardados

    // Iteramos sobre cada enlace y enviamos una solicitud a la API para analizarlo
    const requests = enlacesGuardados.map(url =>
        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: url })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Resultado de la API para", url, ":", data);
            // Si la API detecta que el enlace es peligroso, establecemos el indicador a 1
            if (data.resultado === 'Peligrosa') {
                sospechosoDetectado = 1;
            }
        })
        .catch(error => console.error('Error al conectar con la API:', error))
    );

    // Retornamos el estado del análisis después de todas las solicitudes
    return Promise.all(requests).then(() => ({
        enCorreo: enCorreo ? 1 : 0, // Muestra 1 si está en un correo, 0 si no
        sospechosos: sospechosoDetectado // Muestra 1 si se detectó algún sospechoso, 0 si no
    }));
}

// Escucha los mensajes enviados desde popup.js para ejecutar el análisis de enlaces
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getLinks") {
        analizarEnlaces().then(result => {
            sendResponse(result); // Envía el estado actual (enCorreo y sospechosos)
        });
        // Necesario para indicar que la respuesta es asincrónica
        return true;
    }
});
