import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../context/UserContext'; // Asegúrate de importar el contexto

type EditarProductoNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditarProducto'>;
type EditarProductoRouteProp = RouteProp<RootStackParamList, 'EditarProducto'>;

const EditarProducto: React.FC = () => {
  const navigation = useNavigation<EditarProductoNavigationProp>();
  const route = useRoute<EditarProductoRouteProp>();
  const { user } = useUserContext(); // Aquí obtenemos el usuario del contexto
  const { productoId } = route.params;

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    const fetchProducto = async () => {
      const productoRef = doc(db, 'products', productoId);
      const productoSnap = await getDoc(productoRef);
      if (productoSnap.exists()) {
        const productoData = productoSnap.data();
        setNombre(productoData.nombre);
        setDescripcion(productoData.descripcion);
        setPrecio(productoData.precio);
      } else {
        Alert.alert('Error', 'No se encontró el producto.');
      }
    };

    fetchProducto();
  }, [productoId]);

  const handleSaveChanges = async () => {
    try {
      const productoRef = doc(db, 'products', productoId);
      await updateDoc(productoRef, {
        nombre,
        descripcion,
        precio,
      });
      Alert.alert('Éxito', 'Producto actualizado exitosamente.');

      // Redirige a la pantalla de ProductosEmprendedor con emprendedorId
      if (user?.uid) {
        navigation.navigate('ProductosEmprendedor', { emprendedorId: user.uid });
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al actualizar el producto.');
    }
  };

  return (
    <View style={styles.container}>
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

export default EditarProducto;
