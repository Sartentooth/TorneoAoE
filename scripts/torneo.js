// Función para actualizar los puntos y guardarlos en localStorage
function guardarResultado(winner, loser, winnerCheckbox, loserCheckbox) {
  if (winnerCheckbox.checked && !loserCheckbox.checked) {
    players[winner] += 3;
    players[loser] += 0;
  } else if (!winnerCheckbox.checked && loserCheckbox.checked) {
    players[loser] += 3;
    players[winner] += 0;
  } else {
    // Si ambos están marcados o desmarcados, no hacemos nada
    return;
  }
  
  localStorage.setItem("players", JSON.stringify(players));
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
      <td>${index + 1}</td>
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
