document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('startButton');
  const startAnalysisButton = document.getElementById('startAnalysisButton');
  const page1 = document.getElementById('page1');
  const page2 = document.getElementById('page2');
  const pageLogin = document.getElementById('pageLogin');
  const loginButton = document.getElementById('loginButton');
  const regresarButton = document.getElementById('regresarButton');
  const page3 = document.getElementById('page3');
  const cerrarsesionButton = document.getElementById('cerrarsesionButton');
  const statusBox = document.querySelector('#page3 .status-box');
  const statusText = document.querySelector('#page3 .status-text');
  const page4 = document.getElementById('page4');
  const correoCountElement = document.getElementById('correo-count');
  const sospechososCountElement = document.getElementById('sospechosos-count');

  window.addEventListener("load", function () {
    // Verificar si el usuario ya está logueado
    if (localStorage.getItem("userLoggedIn") === "true") {
        page1.style.display = "none";
        page2.style.display = "block"; // Redirige directamente a la página 2
        pageLogin.style.display = "none";
        page3.style.display = "none";
        page4.style.display = "none";
    } else {
        page1.style.display = "block";
        page2.style.display = "none";
        pageLogin.style.display = "none";
        page3.style.display = "none";
        page4.style.display = "none";
    }
});

  startButton.addEventListener('click', function () {
      console.log("Navegando a la página 2");
      page1.style.display = "none";
      pageLogin.style.display = "block";
  });

  // Función para Login
  loginButton.addEventListener("click", async function () {
    const UserName = document.getElementById("usuarioInput").value;
    const Password = document.getElementById("passwordInput").value;

    console.log("Validando credenciales...");

    try {
        const response = await fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ UserName, Password })
        });

        const data = await response.json();

        if (data.exitoso === 1) {
            alert("Inicio de sesión exitoso");
            localStorage.setItem("userLoggedIn", "true");
            pageLogin.style.display = "none";
            page2.style.display = "block";
        } else {
            alert("Usuario o contraseña incorrectos " + UserName + " " + Password);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error al conectar con el servidor. Intente nuevamente.");
    }
});

regresarButton.addEventListener("click", async function () {
    pageLogin.style.display = "none";
    page1.style.display = "block";
});
function logout() {
    localStorage.removeItem("userLoggedIn");
    page2.style.display = "none";
    pageLogin.style.display = "none";
    page3.style.display = "none";
    page4.style.display = "none";

    page1.style.display = "block"; // Muestra la pantalla de login
}

cerrarsesionButton.addEventListener("click", async function () {
    logout();
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

// Abre una nueva pestaña para el apartado de configuracion
document.addEventListener("DOMContentLoaded", function () {
    const configButton = document.getElementById("configButton");

    if (configButton) {
        configButton.addEventListener("click", function () {
            // Para extensiones de Chrome, usar chrome.tabs.create
            if (chrome && chrome.tabs) {
                chrome.tabs.create({ url: "mockup-opcionesgenerales.html#Paginaconfiguracion" });
            } else {
                // Alternativa para testing fuera de la extensión
                window.open("mockup-opcionesgenerales.html#Paginaconfiguracion", "_blank");
            }
        });
    }
});

