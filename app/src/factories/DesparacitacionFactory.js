// DesparacitacionFactory.js
class Desparacitacion {
  constructor(codigo_desparacitacion, fecha, tipo, nombre, via_administracion, codigo_mascota, estado) {
    this.codigo_desparacitacion = codigo_desparacitacion;
    this.fecha = fecha;
    this.tipo = tipo;
    this.nombre = nombre;
    this.via_administracion = via_administracion;
    this.codigo_mascota = codigo_mascota;
    this.estado = estado;
  }
  getSummary() {
    return `Nombre: ${this.nombre}\n\nVia de Administracion: ${this.via_administracion}\n\nFecha: ${this.fecha}\n`;
  }
}

class DesparacitacionFactory {
  static createDesparacitacion(desparacitacionData) {
    return new Desparacitacion(
      desparacitacionData.codigo_desparacitacion,
      desparacitacionData.fecha,
      desparacitacionData.tipo,
      desparacitacionData.nombre,
      desparacitacionData.via_administracion,
      desparacitacionData.codigo_mascota,
      desparacitacionData.estado
    );
  }
}

export default DesparacitacionFactory;
