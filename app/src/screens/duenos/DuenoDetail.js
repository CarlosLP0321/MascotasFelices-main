// DuenosList.js
import React, {useState} from 'react';
import { View, StyleSheet, Alert, TextInput } from 'react-native';
import { Button, Text, Dialog } from '@rneui/themed';
import { updateDueno } from '../../services/apiService';
import { deleteDueno } from '../../services/apiService';
import {ROUTES} from '../../helpers/routes';

const DuenoDetail = ({onUpdateDueno, route, navigation}) => {

  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);

  const toggleUpdateDialog = () => {
    setVisible1(!visible1);
  };
  const toggleDeleteDialog = () => {
    setVisible2(!visible2);
  };

  const [formState, setFormState] = useState({
    nombre: route.params.nombre,
    apellido: route.params.apellido,
    telefono: route.params.telefono,
    direccion: route.params.direccion,
    correo_electronico: route.params.correo_electronico
  });
  const [errors, setErrors] = useState({});

  const handleChange = (value, name) => {
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

    const updateDuenoData = {
      nombre: formState.nombre,
      apellido: formState.apellido,
      telefono: formState.telefono,
      direccion: formState.direccion,
      correo_electronico: formState.correo_electronico
    };
    await handleUpdateDueno(updateDuenoData);
  };

  const handleUpdateDueno = async updateDuenoData => {
    const response = await updateDueno(route.params.codigo_dueno, updateDuenoData);
    //console.log('Response:', response);
    toggleUpdateDialog();
    Alert.alert('Los datos han sido actualizados exitosamente');
  };

  const handleDelete = async () => {
    try {
      await deleteDueno(route.params.codigo_dueno, { estado: 'inactive'});
      Alert.alert('El dueno ha sido eliminado exitosamente');
      navigation.navigate(ROUTES.DUENOS.STACK.DUENOS_LIST);
      toggleDeleteDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = formState => {
    let errors = {};
    if (!formState.nombre) {
      errors.nombre = 'El campo Nombre es obligatorio';
    }
    if (!formState.apellido) {
      errors.apellido = 'El campo Apellido es obligatorio';
    }
    if (!formState.telefono) {
      errors.telefono = 'El campo Telefono es obligatorio';
    } else if (formState.telefono.length < 8) { errors.telefono = 'El numero de telefono es demasiado corto'; }
    if (!formState.direccion) {
      errors.direccion = 'El campo Direccion es obligatorio';
    }
    if (!formState.correo_electronico) {
      errors.correo_electronico = 'El campo Correo Electronico es obligatorio';
    } else {
      let emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailPattern.test(formState.correo_electronico)) {
        errors.correo_electronico = 'El correo electronico no es valido';
      }
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
      />
      {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

      <Text style={styles.label}>Apellido</Text>
      <TextInput
        style={[styles.input, errors.apellido && styles.errorInput]}
        value={formState.apellido}
        onChangeText={val => handleChange(val, 'apellido')}
      />
      {errors.apellido && <Text style={styles.errorText}>{errors.apellido}</Text>}

      <Text style={styles.label}>Telefono</Text>
      <TextInput
        style={[styles.input, errors.telefono && styles.errorInput]}
        value={formState.telefono}
        onChangeText={val => handleChange(val, 'telefono')}
        keyboardType="numeric"
      />
      {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}

      <Text style={styles.label}>Direccion</Text>
      <TextInput
        style={[styles.input, errors.direccion && styles.errorInput]}
        value={formState.direccion}
        onChangeText={val => handleChange(val, 'direccion')}
      />
      {errors.direccion && <Text style={styles.errorText}>{errors.direccion}</Text>}

      <Text style={styles.label}>Correo Electronico</Text>
      <TextInput
        style={[styles.input, errors.correo_electronico && styles.errorInput]}
        value={formState.correo_electronico}
        onChangeText={val => handleChange(val, 'correo_electronico')}
        keyboardType="email-address"
      />
      {errors.correo_electronico && <Text style={styles.errorText}>{errors.correo_electronico}</Text>}

      <Text style={styles.statusContainer}>Estado: <Text style={{ color: route.params.estado === 'active' ? 'green' : 'red' }}>{route.params.estado}</Text></Text>

      <Button
        title="Actualizar Datos Dueno"
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
        title="Eliminar Dueno"
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
        <Dialog.Title title="¿Está seguro que desea actualizar los datos del dueno?"/>
        <Dialog.Actions>
          <Dialog.Button title="CONFIRMAR" onPress={handleSubmit}/>
          <Dialog.Button title="CANCELAR" onPress={toggleUpdateDialog}/>
        </Dialog.Actions>
      </Dialog>

      <Dialog
      isVisible={visible2}
      onBackdropPress={toggleDeleteDialog}>
        <Dialog.Title title="¿Está seguro que desea eliminar a este dueno?"/>
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

export default DuenoDetail;
