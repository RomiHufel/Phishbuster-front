// Variable global para almacenar la última URL registrada
let lastStoredUrl = "";

// Función que se ejecuta cada vez que una pestaña cambia de URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') { // Solo ejecuta cuando la página carga completamente
    const currentUrl = tab.url;

    // Verifica si la URL actual es diferente a la última almacenada
    if (currentUrl !== lastStoredUrl) {
      // Actualiza la URL almacenada
      chrome.storage.local.set({ lastUrl: currentUrl });
      lastStoredUrl = currentUrl;
      
      // Aquí puedes integrar la función para enviar el URL a tu modelo predictivo
      console.log("Nueva URL almacenada:", currentUrl);
    }
  }
});
