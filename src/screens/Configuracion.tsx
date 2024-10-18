import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // Asegúrate de que la ruta sea correcta
import { useNavigation } from '@react-navigation/native';

type ConfiguracionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Configuracion'>;

const Configuracion: React.FC = () => {
  const navigation = useNavigation<ConfiguracionNavigationProp>();

  return (
    <View>
      <Text>Esta es la pantalla de Configuracion</Text>
    </View>
  );
};

export default Configuracion;
