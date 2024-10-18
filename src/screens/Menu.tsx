import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUserContext } from '../context/UserContext';

type MenuNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Menu'>;

const Menu: React.FC = () => {
  const navigation = useNavigation<MenuNavigationProp>();
  const { user, logout } = useUserContext();

  const handleLogout = () => {
    logout();
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Button title="Perfil" onPress={() => navigation.navigate('Perfil')} />
      <Button title="Configuración" onPress={() => navigation.navigate('Configuracion')} />
      
      {user?.userType === 'Cliente' && (
        <>
          <Button title="Emprendimientos" onPress={() => navigation.navigate('Emprendimientos')} />
          <Button title="Servicios" onPress={() => navigation.navigate('Servicios')} />
        </>
      )}

      {user?.userType === 'Emprendedor' && (
        <>
          <Button title="Publicar Producto" onPress={() => navigation.navigate('PublicarProducto', { emprendedorId: user.uid })} />
          <Button title="Gestionar Productos" onPress={() => navigation.navigate('ProductosEmprendedor', { emprendedorId: user.uid })} />
        </>
      )}

      {user?.userType === 'Independiente' && (
        <>
          <Button title="Publicar Servicio" onPress={() => navigation.navigate('PublicarServicios', { independienteId: user.uid })} />
          <Button title="Gestionar Servicios" onPress={() => navigation.navigate('ServiciosIndependiente')} />
        </>
      )}

      <Button title="Cerrar Sesión" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default Menu;
