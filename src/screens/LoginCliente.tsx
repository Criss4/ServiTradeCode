import React from 'react';
import Login from '../components/Login';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginClienteNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginCliente'>;

const LoginCliente: React.FC = () => {
  const navigation = useNavigation<LoginClienteNavigationProp>();

  const handleForgotPasswordPress = () => {
    // Implementar la lógica para restablecer contraseña si es necesario
  };

  const handleRegisterPress = () => {
    // Navegar a la pantalla de registro
    navigation.navigate('Registro');
  };

  return (
    <Login
      userType="Cliente"
      onForgotPasswordPress={handleForgotPasswordPress}
      onRegisterPress={handleRegisterPress}
    />
  );
};

export default LoginCliente;
