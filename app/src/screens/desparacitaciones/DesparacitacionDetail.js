// DesparacitacionesList.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert, TextInput, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { Button, Text, Dialog } from '@rneui/themed';
import { ROUTES } from '../../helpers/routes';

import { updateDesparacitacion } from '../../services/apiService';
import { deleteDesparacitacion } from '../../services/apiService';

import { getMascotas } from '../../services/apiService';

const DesparacitacionDetail = ({onUpdateDesparacitacion, route, navigation}) => {
  const [mascotas, setMascotas] = useState([]);

  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);

  const toggleUpdateDialog = () => {
    setVisible1(!visible1);
  };
  const toggleDeleteDialog = () => {
    setVisible2(!visible2);
  };
  const toggleCompleteDialog = () => {
    setVisible3(!visible3);
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
    fecha: route.params.fecha,
    tipo: route.params.tipo,
    nombre: route.params.nombre,
    via_administracion: route.params.via_administracion,
    estado: route.params.estado,
    codigo_mascota: route.params.codigo_mascota,
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
      toggleUpdateDialog();
      return;
    }

    const updateDesparacitacionData = {
      fecha: formState.fecha,
      tipo: formState.tipo,
      nombre: formState.nombre,
      via_administracion: formState.via_administracion,
      codigo_mascota: formState.codigo_mascota,
      estado: formState.estado,
    };
    await handleUpdateDesparacitacion(updateDesparacitacionData);
  };

  const handleUpdateDesparacitacion = async updateDesparacitacionData => {
    try {
      await updateDesparacitacion(route.params.codigo_desparacitacion, updateDesparacitacionData);
      toggleUpdateDialog();
      Alert.alert('Los datos han sido actualizados exitosamente');
    } catch (error) {
      toggleUpdateDialog();
      console.log('Error:', error);
      Alert.alert('Error', 'Failed to update ficha de desparacitacion');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDesparacitacion(route.params.codigo_desparacitacion, { estado: 'incompleted'});
      toggleDeleteDialog();
      Alert.alert('La ficha ha sido marcada como incompletada');
      navigation.navigate(ROUTES.DESPARACITACIONES.STACK.DESPARACITACIONES_LIST);
    } catch (error) {
      toggleDeleteDialog();
      console.log(error);
      Alert.alert('Error', 'Failed to delete ficha');
    }
  };

  const handleComplete = async () => {
    try {
      await deleteDesparacitacion(route.params.codigo_desparacitacion, { estado: 'completed'});
      Alert.alert('La cita ha sido marcada como completada');
      toggleCompleteDialog();
      navigation.navigate(ROUTES.DESPARACITACIONES.STACK.DESPARACITACIONES_LIST);
    } catch (error) {
      console.log(error);
      toggleCompleteDialog();
      Alert.alert('Error', 'Failed to mark cita as completed');
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
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{
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

        <Text style={styles.statusContainer}>Estado: <Text style={{ color: route.params.estado === 'done' ? 'green' : route.params.estado === 'pending' ? 'blue' : 'red' }}>{route.params.estado}</Text></Text>

        <Button
          title="Marcar como completada"
          onPress={toggleCompleteDialog}
          icon={{
            name: 'check',
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

        <Button
          title="Actualizar Datos Ficha de Desparacitacion"
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
          title="Eliminar Cita"
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
          <Dialog.Title title="¿Está seguro que desea actualizar los datos de la ficha de desparacitacion?"/>
          <Dialog.Actions>
            <Dialog.Button title="CONFIRMAR" onPress={handleSubmit}/>
            <Dialog.Button title="CANCELAR" onPress={toggleUpdateDialog}/>
          </Dialog.Actions>
        </Dialog>

        <Dialog
        isVisible={visible2}
        onBackdropPress={toggleDeleteDialog}>
          <Dialog.Title title="¿Está seguro que desea eliminar esta ficha de desparacitacion?"/>
          <Dialog.Actions>
            <Dialog.Button title="CONFIRMAR" onPress={handleDelete}/>
            <Dialog.Button title="CANCELAR" onPress={toggleDeleteDialog}/>
          </Dialog.Actions>
        </Dialog>

        <Dialog
        isVisible={visible3}
        onBackdropPress={toggleCompleteDialog}>
          <Dialog.Title title="¿Está seguro que desea marcar esta ficha como completada?"/>
          <Dialog.Actions>
            <Dialog.Button title="CONFIRMAR" onPress={handleComplete}/>
            <Dialog.Button title="CANCELAR" onPress={toggleCompleteDialog}/>
          </Dialog.Actions>
        </Dialog>

      </View>
      }
    </ScrollView>
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

export default DesparacitacionDetail;