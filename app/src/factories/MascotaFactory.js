// MascotaFactory.js
class Mascota {
  constructor(codigo_mascota, nombre, fecha_nacimiento, sexo, especie, raza, estado, codigo_dueno) {
    this.codigo_mascota = codigo_mascota;
    this.nombre = nombre;
    this.fecha_nacimiento = fecha_nacimiento;
    this.sexo = sexo;
    this.especie = especie;
    this.raza = raza;
    this.estado = estado;
    this.codigo_dueno = codigo_dueno;
  }
  getSummary() {
    return `Nombre: ${this.nombre}\n\nEspecie: ${this.especie}\n\nRaza: ${this.raza}\n`;
  }
}

class MascotaFactory {
  static createMascota(mascotaData) {
    return new Mascota(
      mascotaData.codigo_mascota,
      mascotaData.nombre,
      mascotaData.fecha_nacimiento,
      mascotaData.sexo,
      mascotaData.especie,
      mascotaData.raza,
      mascotaData.estado,
      mascotaData.codigo_dueno,
    );
  }
}

export default MascotaFactory;
