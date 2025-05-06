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
    btn.onclick = () => {
      jugadores.splice(index, 1);
      actualizarLista();
    };
    li.appendChild(btn);
    listaUl.appendChild(li);
  });
}

agregarBtn.onclick = () => {
  const nuevos = textarea.value.split('\n').map(j => j.trim()).filter(j => j && !jugadores.includes(j));
  jugadores = [...jugadores, ...nuevos];
  textarea.value = '';
  actualizarLista();
};

function generarFixture(jugadores) {
  const partidos = [];
  for (let i = 0; i < jugadores.length; i++) {
    for (let j = i + 1; j < jugadores.length; j++) {
      partidos.push({ jugador1: jugadores[i], jugador2: jugadores[j], ganador: "" });
    }
  }
  return {
    jugadores,
    partidos
  };
}

generarBtn.onclick = () => {
  const fixture = generarFixture(jugadores);
  const json = JSON.stringify(fixture, null, 2);
  jsonPreview.textContent = json;
  tablaPreview.innerHTML = '';
  fixture.partidos.forEach(p => {
    const row = `<tr><td>${p.jugador1}</td><td>vs</td><td>${p.jugador2}</td><td>${p.ganador || '-'}</td></tr>`;
    tablaPreview.innerHTML += row;
  });
};

descargarBtn.onclick = () => {
  const fixture = generarFixture(jugadores);
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
