// MascotasList.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Button, Text, Dialog } from '@rneui/themed';
import { ROUTES } from '../../helpers/routes';

import { updateMascota } from '../../services/apiService';
import { deleteMascota } from '../../services/apiService';

import { getDuenos } from '../../services/apiService';

const MascotaDetail = ({onUpdateMascota, route, navigation}) => {
  const [duenos, setDuenos] = useState([]);

  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);

  const toggleUpdateDialog = () => {
    setVisible1(!visible1);
  };
  const toggleDeleteDialog = () => {
    setVisible2(!visible2);
  };

  const retrieveDuenos = async () => {
    try {
      const response = await getDuenos();
      setDuenos(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
  
      const retrieve = async () => {
        if (isActive) {
          await retrieveDuenos();
        }
      };
  
      retrieve();
  
      const intervalId = setInterval(() => {
        retrieve();
      }, 5000);
  
      return () => {
        isActive = false;
        clearInterval(intervalId);
      };
    }, [])
  );

  const [formState, setFormState] = useState({
    nombre: route.params.nombre,
    fecha_nacimiento: route.params.fecha_nacimiento,
    sexo: route.params.sexo,
    especie: route.params.especie,
    raza: route.params.raza,
    codigo_dueno: route.params.codigo_dueno,
    estado: route.params.estado
  });
  const [errors, setErrors] = useState({});

  const handleChange = (value, name) => {
    if (name === 'fecha_nacimiento') {
      if (value.length === 4 || value.length === 7) {
        value += '-';
      }
    }
    setFormState({
      ...formState,
      [name]: value,
    });
    // Clear the error when user starts typing again
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm(formState);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toggleUpdateDialog();
      return;
    }

    const updateMascotaData = {
      nombre: formState.nombre,
      fecha_nacimiento: formState.fecha_nacimiento,
      sexo: formState.sexo,
      especie: formState.especie,
      raza: formState.raza,
      codigo_dueno: formState.codigo_dueno,
      estado: formState.estado
    };
    await handleUpdateMascota(updateMascotaData);
  };

  const handleUpdateMascota = async updateMascotaData => {
    const response = await updateMascota(route.params.codigo_mascota, updateMascotaData);
    //console.log('Response:', response);
    toggleUpdateDialog();
    Alert.alert('Los datos han sido actualizados exitosamente');
  };

  const handleDelete = async () => {
    try {
      await deleteMascota(route.params.codigo_mascota, { estado: 'inactive'});
      Alert.alert('La mascota ha sido eliminada exitosamente');
      navigation.navigate(ROUTES.MASCOTAS.STACK.MASCOTAS_LIST);
      toggleDeleteDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = (formState) => {
    let errors = {};

    if (!formState.nombre) {
      errors.nombre = 'El campo nombre es obligatorio';
    }

    if (!formState.fecha_nacimiento) {
      errors.fecha_nacimiento = 'El campo fecha de nacimiento es obligatorio';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formState.fecha_nacimiento)) {
      errors.fecha_nacimiento = 'La fecha de nacimiento debe estar en formato YYYY-MM-DD';
    }

    if (!formState.sexo) {
      errors.sexo = 'El campo sexo es obligatorio';
    }

    if (!formState.especie) {
      errors.especie = 'El campo especie es obligatorio';
    }

    if (!formState.raza) {
      errors.raza = 'El campo raza es obligatorio';
    }

    if (!formState.codigo_dueno) {
      errors.codigo_dueno = 'El campo dueno es obligatorio';
    }
    return errors;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={[styles.input, errors.nombre && styles.errorInput]}
        value={formState.nombre}
        onChangeText={val => handleChange(val, 'nombre')}
        placeholder="Ingrese el nombre de la mascota"
      />
      {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

      <Text style={styles.label}>Fecha de Nacimiento</Text>
      <TextInput
        style={[styles.input, errors.fecha_nacimiento && styles.errorInput]}
        value={formState.fecha_nacimiento}
        onChangeText={val => handleChange(val, 'fecha_nacimiento')}
        placeholder="Ingrese la fecha de nacimiento de la mascota"
        keyboardType='numeric'
      />
      {errors.fecha_nacimiento && <Text style={styles.errorText}>{errors.fecha_nacimiento}</Text>}

      <Text style={styles.label}>Sexo</Text>
      <Picker
        selectedValue={formState.sexo}
        style={[styles.input, errors.sexo && styles.errorInput]}
        onValueChange={(itemValue) => handleChange(itemValue, 'sexo')}
      >
        <Picker.Item label="Seleccione el sexo" value="" />
        <Picker.Item label="Macho" value="M" />
        <Picker.Item label="Hembra" value="H" />
      </Picker>
      {errors.sexo && <Text style={styles.errorText}>{errors.sexo}</Text>}

      <Text style={styles.label}>Especie</Text>
      <TextInput
        style={[styles.input, errors.especie && styles.errorInput]}
        value={formState.especie}
        onChangeText={val => handleChange(val, 'especie')}
        placeholder="Ingrese la especie de la mascota"
      />
      {errors.especie && <Text style={styles.errorText}>{errors.especie}</Text>}

      <Text style={styles.label}>Raza</Text>
      <TextInput
        style={[styles.input, errors.raza && styles.errorInput]}
        value={formState.raza}
        onChangeText={val => handleChange(val, 'raza')}
        placeholder="Ingrese la raza de la mascota"
      />
      {errors.raza && <Text style={styles.errorText}>{errors.raza}</Text>}

      <Text style={styles.label}>Dueño</Text>
      <Picker
        selectedValue={formState.codigo_dueno}
        style={[styles.input, errors.codigo_dueno && styles.errorInput]}
        onValueChange={(itemValue) => handleChange(itemValue, 'codigo_dueno')}
      >
        <Picker.Item label="Seleccione el dueño" value="" />
        {duenos.map((dueno) => (
          dueno.estado === 'active' && <Picker.Item key={dueno.codigo_dueno} label={dueno.nombre +" "+ dueno.apellido} value={dueno.codigo_dueno} />
        ))}
      </Picker>
      {errors.codigo_dueno && <Text style={styles.errorText}>{errors.codigo_dueno}</Text>}

      <Text style={styles.statusContainer}>Estado: <Text style={{ color: route.params.estado === 'active' ? 'green' : 'red' }}>{route.params.estado}</Text></Text>

      <Button
        title="Actualizar Datos Mascota"
        onPress={toggleUpdateDialog}
        icon={{
          name: 'pencil',
          type: 'font-awesome',
          size: 15,
          color: 'white',
        }}
        iconContainerStyle={{ marginRight: 10 }}
        titleStyle={{ fontWeight: '700' }}
        buttonStyle={{
          backgroundColor: '#4d7abf',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 30,
        }}
        containerStyle={{
          width: 300,
          marginHorizontal: 30,
          marginVertical: 10,
        }}
      />
      
      <Button
        title="Eliminar Mascota"
        onPress={toggleDeleteDialog}
        icon={{
          name: 'user-times',
          type: 'font-awesome',
          size: 15,
          color: 'white',
        }}
        iconContainerStyle={{ marginRight: 10 }}
        titleStyle={{ fontWeight: '700' }}
        buttonStyle={{
          backgroundColor: '#fe4a49',
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 30,
        }}
        containerStyle={{
          width: 300,
          marginHorizontal: 30,
          marginVertical: 10,
        }}
      />

      <Dialog
      isVisible={visible1}
      onBackdropPress={toggleUpdateDialog}>
        <Dialog.Title title="¿Está seguro que desea actualizar los datos de la mascota?"/>
        <Dialog.Actions>
          <Dialog.Button title="CONFIRMAR" onPress={handleSubmit}/>
          <Dialog.Button title="CANCELAR" onPress={toggleUpdateDialog}/>
        </Dialog.Actions>
      </Dialog>

      <Dialog
      isVisible={visible2}
      onBackdropPress={toggleDeleteDialog}>
        <Dialog.Title title="¿Está seguro que desea eliminar a esta mascota?"/>
        <Dialog.Actions>
          <Dialog.Button title="CONFIRMAR" onPress={handleDelete}/>
          <Dialog.Button title="CANCELAR" onPress={toggleDeleteDialog}/>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default MascotaDetail;
