import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUserContext } from '../context/UserContext';
import { db } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

type PublicarProductoNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PublicarProducto'>;

interface Props {
  navigation: PublicarProductoNavigationProp;
}

const PublicarProducto: React.FC<Props> = ({ navigation }) => {
  const { user } = useUserContext();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  const handlePublicarProducto = async () => {
    if (!nombre || !descripcion || !precio) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (isNaN(Number(precio)) || Number(precio) <= 0) {
      Alert.alert('Error', 'El precio debe ser un número válido y mayor a 0.');
      return;
    }

    try {
      if (user?.uid) {
        const productRef = await addDoc(collection(db, 'products'), {
          nombre,
          descripcion,
          precio: Number(precio), // Asegurarse de que el precio sea un número
          emprendedorId: user.uid,
        });

        // Guardamos el ID del producto publicado para verificar que es correcto
        console.log('Producto publicado con ID:', productRef.id);

        Alert.alert('Éxito', 'Producto publicado exitosamente.');
        navigation.navigate('PerfilEmprendedor', { emprendedorId: user.uid });
      }
    } catch (error) {
      console.error('Error al publicar el producto:', error);
      Alert.alert('Error', 'Hubo un problema al publicar el producto.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Publicar Producto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción del producto"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio del producto"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />
      <Button title="Publicar" onPress={handlePublicarProducto} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default PublicarProducto;
