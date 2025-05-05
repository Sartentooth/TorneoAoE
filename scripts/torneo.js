// Variable global para almacenar los datos del torneo
let torneoData;
const db = "data/fixture.json";

// obtener los datos del localStorage. Si existen, los convierte de string a objeto JavaScript y los devuelve
function cargarDatosLocalStorage() {
  const datosGuardados = localStorage.getItem("torneoData");
  if (datosGuardados) {
    return JSON.parse(datosGuardados);
  }
  return null;
}

// guardar en localStorage
function guardarDatosLocalStorage() {
  localStorage.setItem("torneoData", JSON.stringify(torneoData));
}

// Preparar datos de jugadores y partidas desde el nuevo formato JSON
function prepararDatos(jsonData) {
  const jugadores = {};
  const partidas = {};

  // Extraer jugadores únicos
  const equiposUnicos = new Set();
  jsonData.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      equiposUnicos.add(match.home_team);
      equiposUnicos.add(match.away_team);
    });
  });

  // Inicializar jugadores con 0 puntos
  equiposUnicos.forEach((equipo) => {
    jugadores[equipo] = { puntos: 0 };
  });

  // Preparar estructura de partidas
  jsonData.rounds.forEach((round) => {
    const rondaKey = `Ronda ${round.Ronda}`;
    partidas[rondaKey] = {};

    round.matches.forEach((match) => {
      const partidaKey = `${match.home_team}_vs_${match.away_team}`;
      partidas[rondaKey][partidaKey] = {
        fecha: match.date,
        lugar: match.venue,
        ganador: "",
      };
    });
  });

  return { jugadores, partidas };
}

// Cargar los datos del JSON
async function cargarDatos() {
  try {
    const datosLocales = cargarDatosLocalStorage();
    if (datosLocales) {
      torneoData = datosLocales;
    } else {
      const response = await fetch(db);
      const jsonData = await response.json();
      torneoData = prepararDatos(jsonData);
    }

    actualizarClasificacion();
    actualizarFixture();
  } catch (error) {
    console.error("Error al cargar los datos:", error);
  }
}

// Actualizar la tabla de clasificación
function actualizarClasificacion() {
  const tbody = document.querySelector("#clasificacion tbody");
  tbody.innerHTML = "";

  // Ordenar jugadores por puntos
  const jugadoresOrdenados = Object.entries(torneoData.jugadores).sort(
    (a, b) => b[1].puntos - a[1].puntos
  );

  jugadoresOrdenados.forEach((jugador, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${jugador[0]}</td>
      <td>${jugador[1].puntos}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Actualizar la tabla de fixture
function actualizarFixture() {
  const tbody = document.querySelector("#fixture tbody");
  tbody.innerHTML = "";

  Object.entries(torneoData.partidas).forEach(([ronda, partidas]) => {
    Object.entries(partidas).forEach(([partida, datos]) => {
      const [jugador1, jugador2] = partida.split("_vs_");
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${ronda}</td>
        <td>${jugador1}</td>
        <td class="ganador-col">
          <div class="checkbox-group">    
            <input type="checkbox" class="cb" name="${ronda}" onchange="cbChange(this, '${partida}', '${jugador1}')">
          </div>
        </td>
        <td class="ganador-col2">
          <div class="checkbox-group">
            <input type="checkbox" class="cb" name="${ronda}" onchange="cbChange(this, '${partida}', '${jugador2}')">
          </div>
        </td>
        <td>${jugador2}</td>
      `;
      tbody.appendChild(tr);
    });
  });
}

// Actualizar resultado de una partida
function cbChange(obj, partida, ganador) {
  const [ronda] = Object.entries(torneoData.partidas).find(([, matches]) =>
    Object.keys(matches).includes(partida)
  );

  // Identificar al perdedor
  const [jugador1, jugador2] = partida.split("_vs_");
  const perdedor = jugador1 === ganador ? jugador2 : jugador1;

  // Actualizar puntos según el estado del checkbox
  if (obj.checked) {
    // Sumar 3 puntos al ganador
    torneoData.jugadores[ganador].puntos += 3;
    torneoData.partidas[ronda][partida].ganador = ganador;
    document.querySelector(
      `input.cb[onchange="cbChange(this, '${partida}', '${perdedor}')"]`
    ).disabled = true;
  } else {
    // Restar 3 puntos si se desmarca
    torneoData.jugadores[ganador].puntos -= 3;
    torneoData.partidas[ronda][partida].ganador = ""; // Limpiar el ganador si se desmarca

    // Habilitar el checkbox del perdedor
    document.querySelector(
      `input.cb[onchange="cbChange(this, '${partida}', '${perdedor}')"]`
    ).disabled = false;
  }

  // Actualizar la tabla de clasificación
  actualizarClasificacion();

  // Guardar el estado actualizado en localStorage
  guardarDatosLocalStorage();
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", cargarDatos);
