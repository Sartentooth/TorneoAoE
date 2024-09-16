// Configuración de Firebase (reemplaza con tus propios datos)
const firebaseConfig = {
  apiKey: "AIzaSyBOm6fL5uvtQxa-cl9TcVi6jhfrc9C3fd8",
  authDomain: "torneoaoe-d39c4.firebaseapp.com",
  databaseURL: "https://torneoaoe-d39c4-default-rtdb.firebaseio.com/",
  projectId: "torneoaoe-d39c4",
  storageBucket: "torneoaoe-d39c4.appspot.com",
  messagingSenderId: "518476517370",
  appId: "1:518476517370:web:a485e17aae3e2e9f165e43",
  measurementId: "G-DF72JC4VJY",
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Función para actualizar los puntos cuando se marca una victoria
function actualizarPuntos(ganador, perdedor) {
  db.ref(`jugadores/${ganador}/puntos`).transaction(
    (puntos) => (puntos || 0) + 3
  );
  db.ref(`jugadores/${perdedor}/puntos`).transaction((puntos) => puntos || 0);
}

// Función para manejar el cambio en los checkboxes
function manejarVictoria(ronda, partido, ganador, perdedor) {
  // Desmarcar el checkbox del otro jugador
  const otroCheckboxId = `ronda${ronda}_${partido}_${perdedor}`;
  document.getElementById(otroCheckboxId).checked = false;

  db.ref(`partidas/ronda${ronda}/${partido}/ganador`)
    .set(ganador)
    .then(() => {
      actualizarPuntos(ganador, perdedor);
      mostrarMensaje(`Victoria registrada: ${ganador} ganó contra ${perdedor}`);
    })
    .catch((error) => {
      console.error("Error al actualizar la victoria:", error);
      mostrarMensaje(
        "Error al registrar la victoria. Por favor, intenta de nuevo."
      );
    });
}

// Función para mostrar mensajes al usuario
function mostrarMensaje(mensaje) {
  const mensajeElement = document.getElementById("mensaje");
  mensajeElement.textContent = mensaje;
  setTimeout(() => {
    mensajeElement.textContent = "";
  }, 3000);
}

// Agregar event listeners a los checkboxes
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    if (event.target.checked) {
      const [ronda, partido, ganador] = event.target.id.split("_");
      const [jugador1, jugador2] = partido.split("vs");
      const perdedor = ganador === jugador1 ? jugador2 : jugador1;
      manejarVictoria(ronda, partido, ganador, perdedor);
    }
  });
});

// Función para actualizar la clasificación en el HTML
function actualizarClasificacion() {
  db.ref("jugadores").once("value", (snapshot) => {
    const jugadores = snapshot.val();
    const clasificacionHTML = Object.entries(jugadores)
      .sort(([, a], [, b]) => (b.puntos || 0) - (a.puntos || 0))
      .map(
        ([nombre, { puntos }]) =>
          `<tr><td>${nombre}</td><td>${puntos || 0}</td></tr>`
      )
      .join("");
    document.querySelector(".ranking table tbody").innerHTML =
      clasificacionHTML;
  });
}

// Llamar a actualizarClasificacion cada vez que cambien los datos
db.ref("jugadores").on("value", actualizarClasificacion);

// Inicializar la clasificación al cargar la página
actualizarClasificacion();
