// DesparacitacionesList.js

import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Text, Card } from '@rneui/themed';
import { useFocusEffect } from '@react-navigation/native';
import { ROUTES } from '../../helpers/routes';

import { getDesparacitaciones } from '../../services/apiService';
import DesparacitacionFactory from '../../factories/DesparacitacionFactory';

const DesparacitacionesList = ({navigation}) => {
  const [desparacitaciones, setDesparacitaciones] = useState([]);
  const [error, setError] = useState(null);

  const retrieveDesparacitaciones = async () => {
    const response = await getDesparacitaciones();
    setDesparacitaciones(response.data.map(data => DesparacitacionFactory.createDesparacitacion(data)));
  };

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
  
      const retrieve = async () => {
        if (isActive) {
          await retrieveDesparacitaciones();
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

const renderDesparacitacionItem = ({item}) => {
  return (
    <View style={styles.itemContainer}>
      <Card containerStyle={{ marginTop: 10, marginBottom: 10}}>
        <Text>{item.getSummary()}</Text>
        <Text>Estado: <Text style={{ color: item.estado === 'completed' ? 'green' : item.estado === 'pending' ? 'blue' : 'red' }}>{item.estado}</Text></Text>
        <Button 
          title="Informacion"
          onPress={() => navigation.navigate(ROUTES.DESPARACITACIONES.STACK.DESPARACITACION_DETAILS, item)} 
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
        title="Agregar Nueva Desparacitacion"
        onPress={() => navigation.navigate(ROUTES.DESPARACITACIONES.STACK.NEW_DESPARACITACION)}
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
          data={desparacitaciones.sort((a, b) => {
            if (a.estado === 'pending' && b.estado !== 'pending') return -1;
            if (a.estado !== 'pending' && b.estado === 'pending') return 1;
            return new Date(a.fecha) - new Date(b.fecha);
          })}
          renderItem={renderDesparacitacionItem}
          keyExtractor={item => item.codigo_desparacitacion.toString()}
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

export default DesparacitacionesList;
