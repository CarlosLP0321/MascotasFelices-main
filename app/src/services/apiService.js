// apiService.js
import axios from 'axios';

const API_BASE_URL = 'https://demu.codersatelier.com/carlos/api/';

const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout after 10 seconds
});

// Seccion Duenos
export const getDuenos = async () => {
  try {
    const response = await apiService.get('/duenos');
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to fetch duenos data');
  }
};

export const addNewDueno = async duenoData => {
  try {
    console.log('Dueno Data:', duenoData);
    const response = await apiService.post('/duenos', duenoData);
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to add new dueno');
  }
};

export const updateDueno = async (id, data) => {
  try {
    const response = await apiService.put(`/duenos/${id}`, data);
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to update dueno');
  }
};

export const deleteDueno = async (id, estado) => {
  try {
    const response = await apiService.patch(`/duenos/${id}`, estado);
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to delete dueno');
  }
};

//Seccion Mascotas
export const getMascotas = async () => {
  try {
    const response = await apiService.get('/mascotas');
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to fetch mascotas data');
  }
};

export const addNewMascota = async mascotaData => {
  try {
    const response = await apiService.post('/mascotas', mascotaData);
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to add new mascota');
  }
};

export const updateMascota = async (id, data) => {
  try {
    const response = await apiService.put(`/mascotas/${id}`, data);
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to update mascota');
  }
};

export const deleteMascota = async (id, estado) => {
  try {
    const response = await apiService.patch(`/mascotas/${id}`, estado);
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to delete mascota');
  }
};

//Seccion Citas
export const getCitas = async () => {
  try {
    const response = await apiService.get('/citas');
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to fetch citas data');
  }
};

export const addNewCita = async citaData => {
  try {
    const response = await apiService.post('/citas', citaData);
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to add new cita');
  }
};

export const updateCita = async (id, data) => {
  try {
    const response = await apiService.put(`/citas/${id}`, data);
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to update cita');
  }
};

export const deleteCita = async (id, estado) => {
  try {
    const response = await apiService.patch(`/citas/${id}`, estado);
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to delete cita');
  }
};

//Seccion Desparacitaciones
export const getDesparacitaciones = async () => {
  try {
    const response = await apiService.get('/desparasitaciones');
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to fetch desparacitacion data');
  }
};

export const addNewDesparacitacion = async desparacitacionData => {
  try {
    console.log('Desparacitacion Data:', desparacitacionData);
    const response = await apiService.post('/desparasitaciones', desparacitacionData);
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to add new cita');
  }
};

export const updateDesparacitacion = async (id, data) => {
  try {
    const response = await apiService.put(`/desparasitaciones/${id}`, data);
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to update desparacitacion');
  }
};

export const deleteDesparacitacion = async (id, estado) => {
  try {
    const response = await apiService.patch(`/desparasitaciones/${id}`, estado);
    return response;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Failed to delete desparacitacion');
  }
};
// Other API methods can be defined here
