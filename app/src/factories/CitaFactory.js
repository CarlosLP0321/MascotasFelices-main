// CitaFactory.js
class Cita {
  constructor(codigo_cita, fechaHora, razon_cita, estado, codigo_mascota) {
    this.codigo_cita = codigo_cita;
    this.fechaHora = fechaHora;
    this.razon_cita = razon_cita;
    this.estado = estado;
    this.codigo_mascota = codigo_mascota;
  }
  getSummary() {
    return `Razon Cita: ${this.razon_cita}\n`;
  }
}

class CitaFactory {
  static createCita(citaData) {
    return new Cita(
      citaData.codigo_cita,
      citaData.fechaHora,
      citaData.razon_cita,
      citaData.estado,
      citaData.codigo_mascota,
    );
  }
}

export default CitaFactory;
