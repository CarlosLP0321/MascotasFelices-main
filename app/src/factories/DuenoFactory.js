// DuenoFactory.js
class Dueno {
  constructor(codigo_dueno, nombre, apellido, telefono, direccion, correo_electronico, estado) {
    this.codigo_dueno = codigo_dueno;
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
    this.direccion = direccion;
    this.correo_electronico = correo_electronico;
    this.estado = estado;
  }
  getSummary() {
    return `Nombre: ${this.nombre} ${this.apellido}\n\nTelefono: ${this.telefono}\n`;
  }
}

class DuenoFactory {
  static createDueno(duenoData) {
    return new Dueno(
      duenoData.codigo_dueno,
      duenoData.nombre,
      duenoData.apellido,
      duenoData.telefono,
      duenoData.direccion,
      duenoData.correo_electronico,
      duenoData.estado,
    );
  }
}

export default DuenoFactory;
