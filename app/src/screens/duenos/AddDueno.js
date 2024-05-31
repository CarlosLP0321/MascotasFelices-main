import React, {useState} from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { Button, Text, Dialog } from '@rneui/themed';
import DuenoFactory from '../../factories/DuenoFactory';
import {addNewDueno} from '../../services/apiService';
import {ROUTES} from '../../helpers/routes';

const AddDuenoForm = ({onAddDueno, navigation}) => {
  const [visible1, setVisible1] = useState(false);
  const toggleAddDialog = () => {
    setVisible1(!visible1);
  };

  const [formState, setFormState] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    correo_electronico: '',
    estado: 'active'
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
      toggleAddDialog();
      return;
    }

    const newDueno = DuenoFactory.createDueno(formState);
    await handleAddDueno(newDueno);
    setFormState({
      nombre: '',
      apellido: '',
      telefono: '',
      direccion: '',
      correo_electronico: '',
      estado: 'active'
    });
  };

  const handleAddDueno = async newDueno => {
    const response = await addNewDueno(newDueno);
    //console.log('Response:', response);
    toggleAddDialog();
    Alert.alert('El dueno a sido agregado exitosamente');
    navigation.navigate(ROUTES.DUENOS.STACK.DUENOS_LIST);
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
        placeholder="Ingrese el nombre"
      />
      {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

      <Text style={styles.label}>Apellido</Text>
      <TextInput
        style={[styles.input, errors.apellido && styles.errorInput]}
        value={formState.apellido}
        onChangeText={val => handleChange(val, 'apellido')}
        placeholder="Ingrese el apellido"
      />
      {errors.apellido && <Text style={styles.errorText}>{errors.apellido}</Text>}

      <Text style={styles.label}>Telefono</Text>
      <TextInput
        style={[styles.input, errors.telefono && styles.errorInput]}
        value={formState.telefono}
        onChangeText={val => handleChange(val, 'telefono')}
        placeholder="Ingrese el numero de telefono"
        keyboardType="numeric"
      />
      {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}

      <Text style={styles.label}>Direccion</Text>
      <TextInput
        style={[styles.input, errors.direccion && styles.errorInput]}
        value={formState.direccion}
        onChangeText={val => handleChange(val, 'direccion')}
        placeholder="Ingrese la direccion"
      />
      {errors.direccion && <Text style={styles.errorText}>{errors.direccion}</Text>}

      <Text style={styles.label}>Correo Electronico</Text>
      <TextInput
        style={[styles.input, errors.correo_electronico && styles.errorInput]}
        value={formState.correo_electronico}
        onChangeText={val => handleChange(val, 'correo_electronico')}
        placeholder="Ingrese el correo electronico"
        keyboardType="email-address"
      />
      {errors.correo_electronico && <Text style={styles.errorText}>{errors.correo_electronico}</Text>}

      <Button
        title="Agregar Dueno"
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
        <Dialog.Title title="¿Está seguro que desea agregar un nuevo dueno?"/>
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

export default AddDuenoForm;
