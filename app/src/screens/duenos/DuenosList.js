// DuenosList.js

import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, Text, Card } from '@rneui/themed';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { ROUTES } from '../../helpers/routes';

import { getDuenos } from '../../services/apiService';
import DuenoFactory from '../../factories/DuenoFactory';

const DuenosList = ({navigation}) => {
  const [duenos, setDuenos] = useState([]);
  const [error, setError] = useState(null);
  const route = useRoute();

  const retrieveDuenos = async () => {
    const response = await getDuenos();
    setDuenos(response.data.map(data => DuenoFactory.createDueno(data)));
  };
  
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
  
      const retrieve = async () => {
        if (isActive) {
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

  const renderDuenoItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Card containerStyle={{ marginTop: 10, marginBottom: 10}}>
        <Text>{item.getSummary()}</Text>
        <Text>Estado: <Text style={{ color: item.estado === 'active' ? 'green' : 'red' }}>{item.estado}</Text></Text>
        <Button 
          title="Informacion"
          onPress={() => navigation.navigate(ROUTES.DUENOS.STACK.DUENO_DETAILS, item)} 
          size="sm" type="clear"
          icon={{
            name: 'user',
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
        title="Agregar Nuevo Dueno"
        onPress={() => navigation.navigate(ROUTES.DUENOS.STACK.NEW_DUENO)}
        icon={{
          name: 'user-plus',
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
          marginHorizontal: 25,
          marginBottom: 15,
          marginTop: -6
        }}
      />

      {error ? (
        <Text>Error: {error}</Text>
      ) : (
        <FlatList
          data={duenos.sort((a, b) => a.estado.localeCompare(b.estado))}
          renderItem={renderDuenoItem}
          keyExtractor={item => item.codigo_dueno.toString()}
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

export default DuenosList;
