// CitasList.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert, TextInput, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Text, Dialog } from '@rneui/themed';
import { ROUTES } from '../../helpers/routes';

import { updateCita } from '../../services/apiService';
import { deleteCita } from '../../services/apiService';

import { getMascotas } from '../../services/apiService';

const CitaDetail = ({onUpdateCita, route, navigation}) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
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

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDatePickerVisible(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setTimePickerVisible(false);
    setTime(currentTime);
  };

  const dateTime = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    time.getHours(),
    time.getMinutes()
  );
  
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
  
      const retrieve = async () => {
        if (isActive && !datePickerVisible && !timePickerVisible) {
          await retrieveMascotas();
          setFormState(prevState => ({
            ...prevState,
            fechaHora: dateTime.toISOString(),
          }));
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
    }, [timePickerVisible, datePickerVisible])
  );

  const [formState, setFormState] = useState({
    fechaHora: route.params.fechaHora,
    razon_cita: route.params.razon_cita,
    estado: route.params.estado,
    codigo_mascota: route.params.codigo_mascota,
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

    const updateCitaData = {
      fechaHora: formState.fechaHora,
      razon_cita: formState.razon_cita,
      estado: formState.estado,
      codigo_mascota: formState.codigo_mascota,
    };
    await handleUpdateCita(updateCitaData);
  };

  const handleUpdateCita = async updateCitaData => {
    const response = await updateCita(route.params.codigo_cita, updateCitaData);
    //console.log('Response:', response);
    toggleUpdateDialog();
    Alert.alert('Los datos han sido actualizados exitosamente');
  };

  const handleDelete = async () => {
    try {
      await deleteCita(route.params.codigo_cita, { estado: 'canceled'});
      Alert.alert('La cita ha sido cancelada exitosamente');
      navigation.navigate(ROUTES.CITAS.STACK.CITAS_LIST);
      toggleDeleteDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const handleComplete = async () => {
    try {
      await deleteCita(route.params.codigo_cita, { estado: 'done'});
      Alert.alert('La cita ha sido marcada como completada');
      navigation.navigate(ROUTES.CITAS.STACK.CITAS_LIST);
      toggleCompleteDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = (formState) => {
    let errors = {};

    if (!formState.razon_cita) {
      errors.razon_cita = 'El campo fecha de nacimiento es obligatorio';
    }

    if (!formState.codigo_mascota) {
      errors.codigo_mascota = 'El campo mascota es obligatorio';
    }
    return errors;
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>{
      <View style={styles.container}>
        <Text style={styles.label}>Razon de la Cita</Text>
        <TextInput
          style={[styles.input, errors.razon_cita && styles.errorInput]}
          value={formState.razon_cita}
          onChangeText={val => handleChange(val, 'razon_cita')}
          placeholder="Ingrese la razon de la cita"
      />
      {errors.razon_cita && <Text style={styles.errorText}>{errors.razon_cita}</Text>}

      <Text style={styles.label}>Fecha y Hora</Text>
      <TextInput
        style={[styles.input, errors.fechaHora && styles.errorInput]}
        value={formState.fechaHora}
        onChangeText={val => handleChange(val, 'fechaHora')}
        placeholder={dateTime.toISOString().slice(0, 16)}
        editable={false}
      />

      <Button
        title="Seleccionar Fecha"
        onPress={() => setDatePickerVisible(true)}
        icon={{
          name: 'calendar',
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
      {datePickerVisible && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Button
        title="Seleccionar Hora"
        onPress={() => setTimePickerVisible(true)}
        icon={{
          name: 'clock-o',
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
      {timePickerVisible && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
      {errors.fechaHora && <Text style={styles.errorText}>{errors.fechaHora}</Text>}

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
          title="Actualizar Datos Cita"
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
          <Dialog.Title title="¿Está seguro que desea actualizar los datos de la cita?"/>
          <Dialog.Actions>
            <Dialog.Button title="CONFIRMAR" onPress={handleSubmit}/>
            <Dialog.Button title="CANCELAR" onPress={toggleUpdateDialog}/>
          </Dialog.Actions>
        </Dialog>

        <Dialog
        isVisible={visible2}
        onBackdropPress={toggleDeleteDialog}>
          <Dialog.Title title="¿Está seguro que desea eliminar esta cita?"/>
          <Dialog.Actions>
            <Dialog.Button title="CONFIRMAR" onPress={handleDelete}/>
            <Dialog.Button title="CANCELAR" onPress={toggleDeleteDialog}/>
          </Dialog.Actions>
        </Dialog>

        <Dialog
        isVisible={visible3}
        onBackdropPress={toggleCompleteDialog}>
          <Dialog.Title title="¿Está seguro que desea marcar esta cita como completada?"/>
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

export default CitaDetail;