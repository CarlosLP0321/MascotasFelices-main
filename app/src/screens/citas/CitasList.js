// CitasList.js

import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Text, Card } from '@rneui/themed';
import { useFocusEffect } from '@react-navigation/native';
import { ROUTES } from '../../helpers/routes';

import { getCitas } from '../../services/apiService';
import CitaFactory from '../../factories/CitaFactory';

const CitasList = ({navigation}) => {
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState(null);

  const retrieveCitas = async () => {
    const response = await getCitas();
    setCitas(response.data.map(data => CitaFactory.createCita(data)));
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
  
      const retrieve = async () => {
        if (isActive) {
          await retrieveCitas();
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

const renderCitaItem = ({item}) => {
  const fechaHora = new Date(item.fechaHora);
  fechaHora.setMinutes(fechaHora.getMinutes() - fechaHora.getTimezoneOffset());
  const year = fechaHora.getFullYear();
  const month = String(fechaHora.getMonth() + 1).padStart(2, '0');
  const day = String(fechaHora.getDate()).padStart(2, '0');
  const time = fechaHora.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <View style={styles.itemContainer}>
      <Card containerStyle={{ marginTop: 10, marginBottom: 10}}>
        <Text>{item.getSummary()}</Text>
        <Text>{`Fecha y Hora: ${time} ${day}-${month}-${year} \n`}</Text>
        <Text>Estado: <Text style={{ color: item.estado === 'done' ? 'green' : item.estado === 'pending' ? 'blue' : 'red' }}>{item.estado}</Text></Text>
        <Button 
          title="Informacion"
          onPress={() => navigation.navigate(ROUTES.CITAS.STACK.CITA_DETAILS, item)} 
          size="sm" type="clear"
          icon={{
            name: 'paw',
            type: 'font-awesome',
            size: 15,
            color: '#4d7abf',
          }}/>
      </Card>
    </View>
  );
};

  return (
    <View style={styles.container}>
      <Button
        title="Agregar Nueva Cita"
        onPress={() => navigation.navigate(ROUTES.CITAS.STACK.NEW_CITA)}
        icon={{
          name: 'paw',
          type: 'font-awesome',
          size: 15,
          color: 'white',
        }}
        iconContainerStyle={{ marginRight: 10 }}
        titleStyle={{ fontWeight: '700' }}
        buttonStyle={{
          backgroundColor: '#4d7abf',
          borderWidth: 0,
          borderRadius: 30,
        }}
        containerStyle={{
          width: 300,
          marginHorizontal: 25,
          marginBottom: 15,
          marginTop: -6
        }}
      />

      {error ? (
        <Text>Error: {error}</Text>
      ) : (
        <FlatList
          data={citas.sort((a, b) => {
            if (a.estado === 'pending' && b.estado !== 'pending') return -1;
            if (a.estado !== 'pending' && b.estado === 'pending') return 1;
            return new Date(a.fechaHora) - new Date(b.fechaHora);
          })}
          renderItem={renderCitaItem}
          keyExtractor={item => item.codigo_cita.toString()}
        />
      )}
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
  }
});

export default CitasList;
