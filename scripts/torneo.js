// Cargar los puntos desde el localStorage, si existen
const players = JSON.parse(localStorage.getItem("players")) || {
  Alros: 0,
  Lolo: 0,
  Tortopulus: 0,
  Sarten: 0,
  Melkor: 0,
  Marqués: 0,
  Lvlaster: 0,
  Nifunifaz: 0,
};

// Función para actualizar los puntos y guardarlos en localStorage
function guardarResultado(winner, loser, isChecked) {
  if (isChecked) {
    players[winner] += 3;
  } else {
    players[winner] -= 3;
  }
  localStorage.setItem("players", JSON.stringify(players)); // Guardar en localStorage
  updateRanking();
}

// Función para actualizar el ranking en la tabla
function updateRanking() {
  const rankingBody = document.querySelector('.ranking table tbody');
  if (!rankingBody) {
    console.error('No se encontró el cuerpo de la tabla de ranking');
    return;
  }

  const sortedPlayers = Object.entries(players).sort((a, b) => b[1] - a[1]);
  rankingBody.innerHTML = "";
  sortedPlayers.forEach(([player, points], index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${player}</td>
      <td>${points}</td>
    `;
    rankingBody.appendChild(row);
  });
}

// Inicializar el ranking al cargar la página
window.onload = function () {
  updateRanking();
};
