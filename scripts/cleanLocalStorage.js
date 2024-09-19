function cleanLocalStorage() {
  if (
    confirm("¿Estás seguro de que deseas limpiar la tabla de Clasificación?")
  ) {
    localStorage.clear();
    alert("La Tabla ha sido limpiada!");
    location.reload();
  } else {
    alert("Acción cancelada.");
  }
}
