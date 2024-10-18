import React from 'react';
import Login from '../components/Login';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginEmprendedorNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginEmprendedor'>;

const LoginEmprendedor: React.FC = () => {
  const navigation = useNavigation<LoginEmprendedorNavigationProp>();

  const handleForgotPasswordPress = () => {
    // Implementar lógica para restablecer contraseña si es necesario
  };

  const handleRegisterPress = () => {
    navigation.navigate('Registro');
  };

  return (
    <Login
      userType="Emprendedor"
      onForgotPasswordPress={handleForgotPasswordPress}
      onRegisterPress={handleRegisterPress}
    />
  );
};

export default LoginEmprendedor;

