import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRoute } from '@react-navigation/native'; // Importa useRoute
import { RootStackParamList } from '../navigation/AppNavigator'; // Ajusta la ruta de tu navegación
import { useUserContext } from '../context/UserContext';
import { db } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

type PublicarServiciosNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PublicarServicios'>;

interface Props {
  navigation: PublicarServiciosNavigationProp;
}

const PublicarServicios: React.FC<Props> = ({ navigation }) => {
  const { user } = useUserContext();
  const route = useRoute(); // Usa useRoute para obtener los parámetros de la navegación
  const { independienteId } = route.params as { independienteId: string };

  const [nombreServicio, setNombreServicio] = useState('');
  const [descripcionServicio, setDescripcionServicio] = useState('');
  const [precioServicio, setPrecioServicio] = useState('');

  const handlePublicarServicio = async () => {
    // Validar entradas antes de publicar
    if (!nombreServicio || !descripcionServicio || !precioServicio) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (isNaN(Number(precioServicio)) || Number(precioServicio) <= 0) {
      Alert.alert('Error', 'El precio debe ser un número válido y mayor a 0.');
      return;
    }

    try {
      const servicioData = {
        nombre: nombreServicio,
        descripcion: descripcionServicio,
        precio: Number(precioServicio), // Asegurar que el precio se guarde como número
        independienteId,
      };

      await addDoc(collection(db, 'services'), servicioData);
      Alert.alert('Éxito', 'Servicio publicado exitosamente.');
      navigation.navigate('Menu');
    } catch (error) {
      console.error('Error al publicar el servicio:', error);
      Alert.alert('Error', 'Hubo un problema al publicar el servicio.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del servicio"
        value={nombreServicio}
        onChangeText={setNombreServicio}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción del servicio"
        value={descripcionServicio}
        onChangeText={setDescripcionServicio}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio del servicio"
        value={precioServicio}
        onChangeText={setPrecioServicio}
        keyboardType="numeric"
      />
      <Button title="Publicar" onPress={handlePublicarServicio} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default PublicarServicios;
