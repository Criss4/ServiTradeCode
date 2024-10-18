import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { RootStackParamList } from '../navigation/AppNavigator'; // Asegúrate de importar esto
import { useUserContext } from '../context/UserContext'; // Asegúrate de importar el contexto

const EditarServicio: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'ServiciosIndependiente'>>();
  const { servicioId } = route.params as { servicioId: string }; // Asegúrate de que params esté bien definido
  const { user } = useUserContext(); // Obtener el contexto del usuario

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    const fetchServicio = async () => {
      const servicioRef = doc(db, 'services', servicioId);
      const servicioSnap = await getDoc(servicioRef);
      if (servicioSnap.exists()) {
        const servicioData = servicioSnap.data();
        setNombre(servicioData.nombre);
        setDescripcion(servicioData.descripcion);
        setPrecio(servicioData.precio);
      } else {
        Alert.alert('Error', 'No se encontró el servicio.');
      }
    };

    fetchServicio();
  }, [servicioId]);

  const handleSaveChanges = async () => {
    try {
      const servicioRef = doc(db, 'services', servicioId);
      await updateDoc(servicioRef, {
        nombre,
        descripcion,
        precio,
      });
      Alert.alert('Éxito', 'Servicio actualizado exitosamente.');

      // Redirige a la pantalla de ServiciosIndependiente
      navigation.navigate('ServiciosIndependiente');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al actualizar el servicio.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del servicio"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción del servicio"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio del servicio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />
      <Button title="Guardar Cambios" onPress={handleSaveChanges} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});

export default EditarServicio;
