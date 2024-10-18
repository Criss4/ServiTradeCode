import React from 'react';
import Login from '../components/Login';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type LoginIndependienteNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginIndependiente'>;

const LoginIndependiente: React.FC = () => {
  const navigation = useNavigation<LoginIndependienteNavigationProp>();

  const handleForgotPasswordPress = () => {
    // Implementar lógica para restablecer contraseña si es necesario
  };

  const handleRegisterPress = () => {
    navigation.navigate('Registro');
  };

  return (
    <Login
      userType="Independiente"
      onForgotPasswordPress={handleForgotPasswordPress}
      onRegisterPress={handleRegisterPress}
    />
  );
};

export default LoginIndependiente;
