import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';
import { Button, Text, Card } from '@rneui/themed';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { ROUTES } from '../helpers/routes';

import { getCitas } from '../services/apiService';
import CitaFactory from '../factories/CitaFactory';

import { getMascotas } from '../services/apiService';
import MascotaFactory from '../factories/MascotaFactory';

import { getDuenos } from '../services/apiService';
import DuenoFactory from '../factories/DuenoFactory';


const HomeScreen = ({navigation}) => {
  const [citas, setCitas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [duenos, setDuenos] = useState([]);
  const [error, setError] = useState(null);

  const retrieveCitas = async () => {
    const response = await getCitas();
    setCitas(response.data.map(data => CitaFactory.createCita(data)));
  };

  const retrieveMascotas = async () => {
    const response = await getMascotas();
    setMascotas(response.data.map(data => MascotaFactory.createMascota(data)));
  };

  const retrieveDuenos = async () => {
    const response = await getDuenos();
    setDuenos(response.data.map(data => DuenoFactory.createDueno(data)));
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
  
      const retrieve = async () => {
        if (isActive) {
          await retrieveCitas();
          await retrieveMascotas();
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
    <ImageBackground
      source={{uri: 'https://i.pinimg.com/474x/f2/b2/a6/f2b2a62e80ab3840aea71fb79783c1d5.jpg'}} // Replace URL with your image URL
      style={styles.container}
      blurRadius={1}>
      <View style={styles.content}>
        <Text style={styles.title}>Bienvenid@ a la app de Mascotas Felices</Text>

        <Text style={styles.sectionsTitle}>Duenos Registrados: {duenos.length}</Text>

        <Text style={styles.sectionsTitle}>Mascotas Registradas: {mascotas.length}</Text>

        <Text style={styles.sectionsTitle}>Citas Registradas</Text>
        {error ? (
          <Text>Error: {error}</Text>
        ) : (
          <FlatList
            nestedScrollEnabled 
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 15,
  },
  sectionsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 25,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  }
});

HomeScreen.navigationOptions = ({navigation}) => ({
  headerShown: navigation.isFirstRouteInParent(), // Hide header if not the initial screen
});

export default HomeScreen;
