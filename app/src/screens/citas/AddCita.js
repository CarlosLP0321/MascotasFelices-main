import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Text, Dialog } from '@rneui/themed';
import { ROUTES } from '../../helpers/routes';

import { addNewCita } from '../../services/apiService';
import CitaFactory from '../../factories/CitaFactory';

import { getMascotas } from '../../services/apiService';

const AddCitaForm = ({onAddCita, navigation}) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
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
    fechaHora: '',
    razon_cita: '',
    estado: 'pending',
    codigo_mascota: '',
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

    const newCita = CitaFactory.createCita(formState);
    await handleAddCita(newCita);
    setFormState({
      fechaHora: '',
      razon_cita: '',
      estado: 'pending',
      codigo_mascota: '',
    });
  };

  const handleAddCita = async (newCita) => {
    try {
      await addNewCita(newCita);
      toggleAddDialog();
      Alert.alert('La cita a sido agregada exitosamente');
      navigation.navigate(ROUTES.CITAS.STACK.CITAS_LIST);
    } catch (error) {
      console.log('Error:', error);
      toggleAddDialog();
      Alert.alert('Error', 'Failed to add new cita');
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
      
      <Button
        title="Agregar Cita"
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
        <Dialog.Title title="¿Está seguro que desea agregar una nueva cita?"/>
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

export default AddCitaForm;