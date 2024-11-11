document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('startButton');
  const startAnalysisButton = document.getElementById('startAnalysisButton');
  const page1 = document.getElementById('page1');
  const page2 = document.getElementById('page2');
  const page3 = document.getElementById('page3');
  const statusBox = document.querySelector('#page3 .status-box');
  const statusText = document.querySelector('#page3 .status-text');
  const page4 = document.getElementById('page4');
  const correoCountElement = document.getElementById('correo-count');
  const sospechososCountElement = document.getElementById('sospechosos-count');

  startButton.addEventListener('click', function () {
      console.log("Navegando a la página 2");
      page1.style.display = 'none';
      page2.style.display = 'block';
  });

  // Función para iniciar el análisis y verificar el estado
  function startAnalysis() {
      console.log("Navegando a la página 3");
      page2.style.display = 'none';
      page3.style.display = 'block';
  
      // Deshabilita el botón para evitar múltiples clics
      startAnalysisButton.disabled = true;
  
      // Verifica si está en un correo y si tiene enlaces
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          const tabId = tabs[0].id;
  
          // Inyecta el content script manualmente
          chrome.scripting.executeScript({
              target: { tabId: tabId },
              files: ["content.js"]
          }, () => {
              if (chrome.runtime.lastError) {
                  statusBox.style.backgroundColor = "red";
                  statusText.textContent = "Estado: Desconectado";
                  startAnalysisButton.disabled = false;
                  return;
              }
  
              // Envía el mensaje al content script para obtener el estado de `enCorreo` y `sospechosos`
              chrome.tabs.sendMessage(tabId, { action: "getLinks" }, response => {
                  if (response) {
                      statusBox.style.backgroundColor = "#5AC933"; // Verde
                      statusText.textContent = "Estado: Conectado";
                      mostrarResultados(response.enCorreo, response.sospechosos); // Muestra el resultado
                  } else {
                      statusBox.style.backgroundColor = "red";
                      statusText.textContent = "Estado: Desconectado";
                      mostrarResultados(0, 0); // Sin correos ni sospechosos detectados
                  }
              });
          });
      });
  }   

  // Muestra los resultados en page4
  function mostrarResultados(correosAnalizados, sospechososDetectados) {
      correoCountElement.textContent = correosAnalizados;
      sospechososCountElement.textContent = sospechososDetectados;
      page3.style.display = 'none';
      page4.style.display = 'block';
      startAnalysisButton.disabled = false;
  }

  // Configura el listener de clic en el botón de análisis
  startAnalysisButton.removeEventListener('click', startAnalysis);
  startAnalysisButton.addEventListener('click', startAnalysis);
});
