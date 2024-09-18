// Variable global para almacenar los datos del torneo
const torneoData = "";
const db = "data/dbase.json";

// Cargar los datos del JSON
async function cargarDatos() {
  // Carga datos desde localStorage, sino hay, carga desde db.json
  const datosGuardados = localStorage.getItem("torneoData");

  if (datosGuardados) {
    torneoData = JSON.parse(datosGuardados);
    console.log("Datos cargados desde localStorage");
  } else {
    try {
      const response = await fetch(db);
      torneoData = await response.json();
      console.log(torneoData.jugadores);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  }

  actualizarClasificacion();
  actualizarFixture();
}

// Guardar datos en localStorage al actualizar la clasificación
function guardarDatosLocal() {
  localStorage.setItem("toneroData", JSON.stringify(torneoData));
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

  // guardar los datos en localStorage
  guardarDatosLocal();
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
                <label class="custom-checkbox">
                        <input type="checkbox" onchange="actualizarResultado('${ronda}', '${partida}', '${jugador1}', this.checked)">
                        <span class="checkmark"></span>
                    </label>
                    </td>
                    <td class="ganador-col">
                    <label class="custom-checkbox">
                        <input type="checkbox" onchange="actualizarResultado('${ronda}', '${partida}', '${jugador2}', this.checked)">
                        <span class="checkmark"></span>
                    </label>
                    </div>
                </td>
                <td>${jugador2}</td>
            `;
      tbody.appendChild(tr);
    });
  });
}

// Actualizar resultado de una partida
function actualizarResultado(ronda, partida, ganador, checked) {
  const [jugador1, jugador2] = partida.split("_vs_");
  const perdedor = jugador1 === ganador ? jugador2 : jugador1;

  // Actualizar puntos
  if (checked) {
    torneoData.jugadores[ganador].puntos += 3;
    torneoData.partidas[ronda][partida].ganador = ganador;
  } else {
    torneoData.jugadores[ganador].puntos -= 3;
    torneoData.partidas[ronda][partida].ganador = "";
  }

  // Asegurar que solo un checkbox esté marcado
  const checkboxes = document.querySelectorAll(
    `input[type="checkbox"][onchange^="actualizarResultado('${ronda}', '${partida}')"]`
  );
  checkboxes.forEach((cb) => {
    if (cb !== e.target) cb.checked = false;
  });

  actualizarClasificacion();
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", cargarDatos);
