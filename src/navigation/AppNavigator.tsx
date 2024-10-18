import React, {useContext} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/Home';
import LoginCliente from '../screens/LoginCliente';
import LoginEmprendedor from '../screens/LoginEmprendedor';
import LoginIndependiente from '../screens/LoginIndependiente';
import Registro from '../screens/Registro';
import Menu from '../screens/Menu'; 
import Perfil from '../screens/Perfil';
import Servicios from '../screens/Servicios';
import Configuracion from '../screens/Configuracion';
import EditarPerfil from '../screens/EditarPerfil';
import Emprendimientos from '../screens/Emprendimientos';
import PerfilEmprendedor from '../screens/PerfilEmprendedor';
import PerfilIndependiente from '../screens/PerfilIndependiente';
import PublicarProducto from '../screens/PublicarProducto';
import PublicarServicios from '../screens/PublicarServicio';
import ProductosEmprendedor from '../screens/ProductosEmprendedor';
import EditarProducto from '../screens/EditarProducto';
import ServiciosIndependiente from '../screens/ServiciosIndependiente'; // Importa la nueva pantalla
import EditarServicio from '../screens/EditarServicio'; // Importa la pantalla de edición


export type RootStackParamList = {
  Home: undefined;
  LoginCliente: undefined;
  LoginEmprendedor: undefined;
  LoginIndependiente: undefined;
  Registro: undefined;
  Menu: undefined; 
  Perfil: undefined;
  Servicios: undefined;
  Emprendimientos: undefined;
  Configuracion: undefined;
  EditarPerfil: undefined;
  ServiciosIndependiente: undefined;
  PerfilIndependiente: { independienteId: string };
  PerfilEmprendedor: { emprendedorId: string };
  PublicarProducto: { emprendedorId: string };
  PublicarServicios: { independienteId: string };
  ProductosEmprendedor: { emprendedorId: string };
  EditarProducto: { productoId: string };
  EditarServicio: { servicioId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="LoginCliente" component={LoginCliente} />
        <Stack.Screen name="LoginEmprendedor" component={LoginEmprendedor} />
        <Stack.Screen name="LoginIndependiente" component={LoginIndependiente} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Perfil" component={Perfil} />
        <Stack.Screen name="Servicios" component={Servicios} />
        <Stack.Screen name="Emprendimientos" component={Emprendimientos} />
        <Stack.Screen name="Configuracion" component={Configuracion} />
        <Stack.Screen name="EditarPerfil" component={EditarPerfil} />
        <Stack.Screen name="PerfilIndependiente" component={PerfilIndependiente} />
        <Stack.Screen name="PerfilEmprendedor" component={PerfilEmprendedor} />
        <Stack.Screen name="PublicarProducto" component={PublicarProducto} />
        <Stack.Screen name="PublicarServicios" component={PublicarServicios} />
        <Stack.Screen name="ProductosEmprendedor" component={ProductosEmprendedor} />
        <Stack.Screen name="ServiciosIndependiente" component={ServiciosIndependiente} />
        <Stack.Screen name="EditarProducto" component={EditarProducto} />
        <Stack.Screen name="EditarServicio" component={EditarServicio} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
