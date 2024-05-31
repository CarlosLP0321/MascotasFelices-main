import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Button, Text, Dialog } from '@rneui/themed';
import { ROUTES } from '../../helpers/routes';

import { addNewDesparacitacion } from '../../services/apiService';
import DesparacitacionFactory from '../../factories/DesparacitacionFactory';

import { getMascotas } from '../../services/apiService';

const AddDesparacitacionForm = ({onAddDesparacitacion, navigation}) => {
  const [mascotas, setMascotas] = useState([]);

  const [visible1, setVisible1] = useState(false);
  const toggleAddDialog = () => {
    setVisible1(!visible1);
  };

  const retrieveMascotas = async () => {
    try {
      const response = await getMascotas();
      setMascotas(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
  
      const retrieve = async () => {
        if (isActive) {
          await retrieveMascotas();
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
    fecha: '',
    tipo: '',
    nombre: '',
    via_administracion: '',
    codigo_mascota: '',
    estado: 'pending',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (value, name) => {
    if (name === 'fecha') {
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

    const newDesparacitacion = DesparacitacionFactory.createDesparacitacion(formState);
    await handleAddDesparacitacion(newDesparacitacion);
    setFormState({
      fecha: '',
      tipo: '',
      nombre: '',
      via_administracion: '',
      codigo_mascota: '',
      estado: 'pending',
    });
  };

  const handleAddDesparacitacion = async (newDesparacitacion) => {
    try {
      await addNewDesparacitacion(newDesparacitacion);
      toggleAddDialog();
      Alert.alert('La ficha de desparacitacion a sido agregada exitosamente');
      navigation.navigate(ROUTES.DESPARACITACIONES.STACK.DESPARACITACIONES_LIST);
    } catch (error) {
      console.log('Error:', error);
      toggleAddDialog();
      Alert.alert('Error', 'Failed to add new ficha de desparacitacion');
    }
  };

  const validateForm = (formState) => {
    let errors = {};

    if (!formState.fecha) {
      errors.fecha = 'El campo fecha es obligatorio';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formState.fecha)) {
      errors.fecha = 'La fecha debe estar en formato YYYY-MM-DD';
    }

    if (!formState.tipo) {
      errors.tipo = 'El campo tipo es obligatorio';
    }

    if (!formState.nombre) {
      errors.nombre = 'El campo nombre es obligatorio';
    }

    if (!formState.via_administracion) {
      errors.via_administracion = 'El campo via de administracion es obligatorio';
    }

    if (!formState.codigo_mascota) {
      errors.codigo_mascota = 'El campo mascota es obligatorio';
    }
    return errors;
  };

  return (
    <View style={styles.container}>

      <Text style={styles.label}>Fecha</Text>
      <TextInput
        style={[styles.input, errors.fecha && styles.errorInput]}
        value={formState.fecha}
        onChangeText={val => handleChange(val, 'fecha')}
        placeholder="Ingrese la fecha de nacimiento de la mascota"
        keyboardType='numeric'
      />
      {errors.fecha && <Text style={styles.errorText}>{errors.fecha}</Text>}

      <Text style={styles.label}>Tipo</Text>
        <TextInput
          style={[styles.input, errors.tipo && styles.errorInput]}
          value={formState.tipo}
          onChangeText={val => handleChange(val, 'tipo')}
          placeholder="Ingrese el tipo de desparacitacion"
      />
      {errors.tipo && <Text style={styles.errorText}>{errors.tipo}</Text>}

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={[styles.input, errors.nombre && styles.errorInput]}
        value={formState.nombre}
        onChangeText={val => handleChange(val, 'nombre')}
        placeholder="Ingrese el nombre"
      />
      {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

      <Text style={styles.label}>Via de Administracion</Text>
      <TextInput
        style={[styles.input, errors.via_administracion && styles.errorInput]}
        value={formState.via_administracion}
        onChangeText={val => handleChange(val, 'via_administracion')}
        placeholder="Ingrese la via de administracion"
      />
      {errors.via_administracion && <Text style={styles.errorText}>{errors.via_administracion}</Text>}

      <Text style={styles.label}>Mascota</Text>
      <Picker
        selectedValue={formState.codigo_mascota}
        style={[styles.input, errors.codigo_mascota && styles.errorInput]}
        onValueChange={(itemValue) => handleChange(itemValue, 'codigo_mascota')}
      >
        <Picker.Item label="Seleccione la mascota" value="" />
        {mascotas.map((mascota) => (
          mascota.estado === 'active' && <Picker.Item key={mascota.codigo_mascota} label={mascota.nombre +" - "+ mascota.especie +" - "+ mascota.raza} value={mascota.codigo_mascota} />
        ))}
      </Picker>
      {errors.codigo_mascota && <Text style={styles.errorText}>{errors.codigo_mascota}</Text>}
      
      <Button
        title="Agregar Desparacitacion"
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
        <Dialog.Title title="¿Está seguro que desea agregar una ficha de desparacitacion?"/>
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

export default AddDesparacitacionForm;