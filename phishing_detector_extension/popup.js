document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('startButton');
  const startAnalysisButton = document.getElementById('startAnalysisButton');
  const page1 = document.getElementById('page1');
  const page2 = document.getElementById('page2');
  const page3 = document.getElementById('page3');
  const page4 = document.getElementById('page4'); // Agrega referencia a page4

  startButton.addEventListener('click', function () {
    console.log("Navegando a la página 2");
    page1.style.display = 'none';
    page2.style.display = 'block';
  });

  startAnalysisButton.addEventListener('click', function () {
    console.log("Navegando a la página 3");
    page2.style.display = 'none';
    page3.style.display = 'block';

    // Después de 5 segundos, cambia a page4
    setTimeout(function () {
      console.log("Cambiando a la página de resultados (page4)");
      page3.style.display = 'none';
      page4.style.display = 'block';
    }, 5000); // 5000 milisegundos = 5 segundos
  });
});
