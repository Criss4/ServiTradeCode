import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useUserContext } from '../context/UserContext';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator'; // O la ruta correcta a tu archivo

type ProductosEmprendedorNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductosEmprendedor'
>;

interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  emprendedorId: string; // Agregamos emprendedorId aquí para solucionar el error
}

const ProductosEmprendedor: React.FC = () => {
  const { user } = useUserContext();
  const [productos, setProductos] = useState<Producto[]>([]);
  const navigation = useNavigation<ProductosEmprendedorNavigationProp>();

  useEffect(() => {
    const fetchProductos = async () => {
      if (user?.uid) {
        try {
          const productosSnapshot = await getDocs(collection(db, 'products'));
          const productosList: Producto[] = productosSnapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() } as Producto))
            .filter((producto) => producto.emprendedorId === user.uid);
          setProductos(productosList);
        } catch (error) {
          Alert.alert('Error', 'Hubo un problema al cargar los productos.');
        }
      }
    };

    fetchProductos();
  }, [user]);

  const handleDeleteProducto = async (productoId: string) => {
    Alert.alert('Confirmación', '¿Estás seguro de que deseas eliminar este producto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'products', productoId));
            Alert.alert('Producto eliminado', 'El producto ha sido eliminado exitosamente.');
            setProductos(productos.filter((producto) => producto.id !== productoId)); // Actualizar la lista
          } catch (error) {
            Alert.alert('Error', 'Hubo un problema al eliminar el producto.');
          }
        },
      },
    ]);
  };

  const renderProducto = ({ item }: { item: Producto }) => (
    <View style={styles.productoContainer}>
      <Text>Nombre: {item.nombre}</Text>
      <Text>Descripción: {item.descripcion}</Text>
      <Text>Precio: {item.precio}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('EditarProducto', { productoId: item.id })}>
          <Icon name="pencil" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProducto(item.id)}>
          <Icon name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={productos}
        renderItem={renderProducto}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No hay productos publicados</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  productoContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default ProductosEmprendedor;

