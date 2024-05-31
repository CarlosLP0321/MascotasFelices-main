// MascotasList.js

import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Text, Card } from '@rneui/themed';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { ROUTES } from '../../helpers/routes';

import { getMascotas } from '../../services/apiService';
import MascotaFactory from '../../factories/MascotaFactory';

const MascotasList = ({navigation}) => {
  const [mascotas, setMascotas] = useState([]);
  const [error, setError] = useState(null);
  const route = useRoute();

  const retrieveMascotas = async () => {
    const response = await getMascotas();
    setMascotas(response.data.map(data => MascotaFactory.createMascota(data)));
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

  const renderMascotaItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Card containerStyle={{ marginTop: 10, marginBottom: 10}}>
        <Text>{item.getSummary()}</Text>
        <Text>Estado: <Text style={{ color: item.estado === 'active' ? 'green' : 'red' }}>{item.estado}</Text></Text>
        <Button 
          title="Informacion"
          onPress={() => navigation.navigate(ROUTES.MASCOTAS.STACK.MASCOTA_DETAILS, item)} 
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

  return (
    <View style={styles.container}>
      <Button
        title="Agregar Nueva Mascota"
        onPress={() => navigation.navigate(ROUTES.MASCOTAS.STACK.NEW_MASCOTA)}
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
          data={mascotas.sort((a, b) => a.estado.localeCompare(b.estado))}
          renderItem={renderMascotaItem}
          keyExtractor={item => item.codigo_mascota.toString()}
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

export default MascotasList;
