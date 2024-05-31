import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Button, Text, Dialog } from '@rneui/themed';
import { ROUTES } from '../../helpers/routes';

import { addNewMascota } from '../../services/apiService';
import MascotaFactory from '../../factories/MascotaFactory';

import { getDuenos } from '../../services/apiService';

const AddMascotaForm = ({onAddMascota, navigation}) => {
  const [duenos, setDuenos] = useState([]);

  const [visible1, setVisible1] = useState(false);
  const toggleAddDialog = () => {
    setVisible1(!visible1);
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
    nombre: '',
    fecha_nacimiento: '',
    sexo: '',
    especie: '',
    raza: '',
    codigo_dueno: '',
    estado: 'active'
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
      toggleAddDialog();
      return;
    }

    const newMascota = MascotaFactory.createMascota(formState);
    await handleAddMascota(newMascota);
    setFormState({
      nombre: '',
      fecha_nacimiento: '',
      sexo: '',
      especie: '',
      raza: '',
      codigo_dueno: '',
      estado: 'active'
    });
  };

  const handleAddMascota = async (newMascota) => {
    try {
      await addNewMascota(newMascota);
      toggleAddDialog();
      Alert.alert('La mascota a sido agregada exitosamente');
      navigation.navigate(ROUTES.MASCOTAS.STACK.MASCOTAS_LIST);
    } catch (error) {
      console.log('Error:', error);
      toggleAddDialog();
      Alert.alert('Error', 'Failed to add new mascota');
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

      <Button
        title="Agregar Mascota"
        onPress={toggleAddDialog}
        icon={{
          name: 'plus',
          type: 'font-awesome',
          size: 15,
          color: 'white',
        }}
        iconContainerStyle={{ marginRight: 10 }}
        titleStyle={{ fontWeight: '700' }}
        buttonStyle={{
          backgroundColor: '#52cc37',
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
      onBackdropPress={toggleAddDialog}>
        <Dialog.Title title="¿Está seguro que desea agregar una nueva mascota?"/>
        <Dialog.Actions>
          <Dialog.Button title="CONFIRMAR" onPress={handleSubmit}/>
          <Dialog.Button title="CANCELAR" onPress={toggleAddDialog}/>
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
    marginBottom: 20,
  },
});

export default AddMascotaForm;