const textarea = document.getElementById('jugadores');
const agregarBtn = document.getElementById('agregarJugadores');
const listaUl = document.getElementById('listaJugadores');
const generarBtn = document.getElementById('generarFixture');
const jsonPreview = document.getElementById('jsonPreview');
const tablaPreview = document.getElementById('tablaPreview');
const descargarBtn = document.getElementById('descargarJSON');
const verJSONBtn = document.getElementById('verJSON');
const verTablaBtn = document.getElementById('verTabla');

let jugadores = [];

function actualizarLista() {
  listaUl.innerHTML = '';
  jugadores.forEach((jugador, index) => {
    const li = document.createElement('li');
    li.textContent = jugador;
    const btn = document.createElement('button');
    btn.textContent = 'X';
    btn.classList.add('cleanAll');
    btn.onclick = () => {
      jugadores.splice(index, 1);
      actualizarLista();
    };
    li.appendChild(btn);
    listaUl.appendChild(li);
  });
}

agregarBtn.onclick = () => {
  const nuevos = textarea.value
    .split('\n')
    .map(j => j.trim())
    .filter(j => j && !jugadores.includes(j));
  jugadores = [...jugadores, ...nuevos];
  textarea.value = '';
  actualizarLista();
};

function roundRobinFixture(teams) {
  const n = teams.length;
  const useBye = n % 2 !== 0;
  if (useBye) teams.push('Descanso');
  const totalRounds = teams.length - 1;
  const matchesPerRound = teams.length / 2;

  const rounds = [];
  let fechaInicio = new Date();
  for (let round = 0; round < totalRounds; round++) {
    const matches = [];
    for (let i = 0; i < matchesPerRound; i++) {
      const home = teams[i];
      const away = teams[teams.length - 1 - i];
      if (home === 'Descanso' || away === 'Descanso') continue;
      const matchDate = new Date(fechaInicio.getTime() + round * 7 * 24 * 60 * 60 * 1000);
      const formattedDate = matchDate.toLocaleDateString('es-AR');
      matches.push({
        round: round + 1,
        home_team: home,
        away_team: away,
        date: formattedDate,
        venue: `Estadio ${home}`
      });
    }
    rounds.push({ Ronda: round + 1, matches });
    teams.splice(1, 0, teams.pop()); // rotación
  }

  return {
    tournament: "Torneo Round Robin",
    total_teams: useBye ? teams.length - 1 : teams.length,
    start_date: new Date().toLocaleDateString('es-AR'),
    rounds
  };
}

generarBtn.onclick = () => {
  const fixture = roundRobinFixture([...jugadores]);
  jsonPreview.textContent = JSON.stringify(fixture, null, 2);

  // render tabla
  tablaPreview.innerHTML = '';
  const table = document.createElement('table');
  const thead = `
    <thead>
      <tr>
        <th>Ronda</th>
        <th>Local</th>
        <th>Visitante</th>
      </tr>
    </thead>
  `;
  table.innerHTML = thead;
  const tbody = document.createElement('tbody');

  fixture.rounds.forEach(ronda => {
    ronda.matches.forEach(match => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>Ronda ${match.round}</td>
        <td>${match.home_team}</td>
        <td>${match.away_team}</td>
      `;
      tbody.appendChild(tr);
    });
  });

  table.appendChild(tbody);
  tablaPreview.appendChild(table);
};

descargarBtn.onclick = () => {
  const fixture = roundRobinFixture([...jugadores]);
  const blob = new Blob([JSON.stringify(fixture, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fixture.json';
  a.click();
  URL.revokeObjectURL(url);
};

verJSONBtn.onclick = () => {
  jsonPreview.style.display = 'block';
  tablaPreview.style.display = 'none';
};

verTablaBtn.onclick = () => {
  jsonPreview.style.display = 'none';
  tablaPreview.style.display = 'block';
};
