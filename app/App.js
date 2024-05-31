// App.js
import React from 'react';
import { StyleSheet } from 'react-native';
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {getFocusedRouteNameFromRoute, NavigationContainer} from '@react-navigation/native';
import { Button, Text, Card } from '@rneui/themed';
import {ROUTES} from './src/helpers/routes';
import HomeScreen from './src/screens/HomeScreen';
import WebSocket from './src/screens/labs/Websocket';
//Seccion Duenos
import DuenosList from './src/screens/duenos/DuenosList';
import DuenoDetail from './src/screens/duenos/DuenoDetail';
import AddDuenoForm from './src/screens/duenos/AddDueno';
//Seccion Mascotas
import MascotasList from './src/screens/mascotas/MascotasList';
import MascotaDetail from './src/screens/mascotas/MascotaDetail';
import AddMascotaForm from './src/screens/mascotas/AddMascota';
//Seccion citas
import CitasList from './src/screens/citas/CitasList';
import CitaDetail from './src/screens/citas/CitaDetail';
import AddCitaForm from './src/screens/citas/AddCita';
//Seccion desoaracitaciones
import DesparacitacionesList from './src/screens/desparacitaciones/DesparacitacionesList';
import DesparacitacionDetail from './src/screens/desparacitaciones/DesparacitacionDetail';
import AddDesparacitacionForm from './src/screens/desparacitaciones/AddDesparacitacion';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName={ROUTES.HOME.STACK.HOME}>
      <Stack.Screen
        name={ROUTES.HOME.STACK.HOME}
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function DuenosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.DUENOS.STACK.DUENOS_LIST}
        component={DuenosList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.DUENOS.STACK.DUENO_DETAILS}
        component={DuenoDetail}
      />
      <Stack.Screen
        name={ROUTES.DUENOS.STACK.NEW_DUENO}
        component={AddDuenoForm}
      />
    </Stack.Navigator>
  );
}

function MascotasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.MASCOTAS.STACK.MASCOTAS_LIST}
        component={MascotasList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.MASCOTAS.STACK.MASCOTA_DETAILS}
        component={MascotaDetail}
      />
      <Stack.Screen
        name={ROUTES.MASCOTAS.STACK.NEW_MASCOTA}
        component={AddMascotaForm}
      />
    </Stack.Navigator>
  );
}

function CitasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.CITAS.STACK.CITAS_LIST}
        component={CitasList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.CITAS.STACK.CITA_DETAILS}
        component={CitaDetail}
      />
      <Stack.Screen
        name={ROUTES.CITAS.STACK.NEW_CITA}
        component={AddCitaForm}
      />
    </Stack.Navigator>
  );
}

function DesparacitacionesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.DESPARACITACIONES.STACK.DESPARACITACIONES_LIST}
        component={DesparacitacionesList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={ROUTES.DESPARACITACIONES.STACK.DESPARACITACION_DETAILS}
        component={DesparacitacionDetail}
      />
      <Stack.Screen
        name={ROUTES.DESPARACITACIONES.STACK.NEW_DESPARACITACION}
        component={AddDesparacitacionForm}
      />
    </Stack.Navigator>
  );
}

function LabsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.LABS.STACK.WEBSOCKET}
        component={WebSocket}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? ROUTES.HOME.HOME;
  switch (routeName) {
    case undefined:
      return 'Veterinaria Mascotas Felices';
    case ROUTES.DUENOS.STACK.DUENOS_LIST:
      return 'Lista de Duenos Registrados';
    case ROUTES.DUENOS.STACK.NEW_DUENO:
      return 'Agregar dueno';
    case ROUTES.LABS.INDEX:
      return 'WebSocket';
    default:
      return 'Not implemented yet';
  }
}

function shouldRenderDrawerParent(route) {
  const routeName = getFocusedRouteNameFromRoute(route);
  //console.log(routeName);
  switch (routeName) {
    case undefined:
    case ROUTES.DUENOS.STACK.DUENOS_LIST:
    case ROUTES.MASCOTAS.STACK.MASCOTAS_LIST:
    case ROUTES.CITAS.STACK.CITAS_LIST:
    case ROUTES.DESPARACITACIONES.STACK.DESPARACITACIONES_LIST:
    case ROUTES.LABS.INDEX:
      return true;
    default:
      return false;
  }
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      <DrawerItemList {...props} />
      <Text style={styles.name}>Carlos Lemus</Text>
      <Text style={styles.title}>Technologies used in this project:</Text>
      <Text style={styles.description}>React Native, Axios, JavaScript</Text>
      <Text style={styles.link}>GitHub: https://github.com/Carlos-Lemus195/MascotasFelices</Text>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    marginLeft: 10,
  },
  link: {
    fontSize: 14,
    color: 'blue',
    marginTop: 10,
  },
});

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName={ROUTES.HOME.INDEX} drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name={ROUTES.HOME.INDEX}
          component={HomeStack}
          options={({route}) => ({
            headerTitle: 'Inicio',
            drawerLabel: 'Inicio',
            headerShown: shouldRenderDrawerParent(route),
          })}
        />
        <Drawer.Screen
          name={ROUTES.DUENOS.INDEX}
          component={DuenosStack}
          options={({route}) => ({
            headerTitle: 'Duenos',
            drawerLabel: 'Duenos',
            headerShown: shouldRenderDrawerParent(route),
          })}
        />
        <Drawer.Screen
          name={ROUTES.MASCOTAS.INDEX}
          component={MascotasStack}
          options={({route}) => ({
            headerTitle: 'Mascotas',
            drawerLabel: 'Mascotas',
            headerShown: shouldRenderDrawerParent(route),
          })}
        />
        <Drawer.Screen
          name={ROUTES.CITAS.INDEX}
          component={CitasStack}
          options={({route}) => ({
            headerTitle: 'Citas',
            drawerLabel: 'Citas',
            headerShown: shouldRenderDrawerParent(route),
          })}
        />
        <Drawer.Screen
          name={ROUTES.DESPARACITACIONES.INDEX}
          component={DesparacitacionesStack}
          options={({route}) => ({
            headerTitle: 'Desparacitaciones',
            drawerLabel: 'Desparacitaciones',
            headerShown: shouldRenderDrawerParent(route),
          })}
        />
        <Drawer.Screen
          name="Labs"
          component={WebSocket}
          options={({route}) => ({
            headerTitle: 'WebSocket',
            drawerLabel: 'WebSocket',
            headerShown: shouldRenderDrawerParent(route),
          })}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
