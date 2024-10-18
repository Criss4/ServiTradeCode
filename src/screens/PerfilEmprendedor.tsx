import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { db } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

type PerfilEmprendedorNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PerfilEmprendedor'>;
type PerfilEmprendedorRouteProp = RouteProp<RootStackParamList, 'PerfilEmprendedor'>;

interface Props {
  navigation: PerfilEmprendedorNavigationProp;
  route: PerfilEmprendedorRouteProp;
}

const PerfilEmprendedor: React.FC<Props> = ({ route }) => {
  const { emprendedorId } = route.params;
  const [emprendedor, setEmprendedor] = useState<any>(null);
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmprendedor = async () => {
      try {
        const emprendedorDoc = await getDoc(doc(db, 'users', emprendedorId));
        if (emprendedorDoc.exists()) {
          setEmprendedor(emprendedorDoc.data());
        } else {
          Alert.alert('Error', 'No se encontró el perfil del emprendedor.');
        }
      } catch (error) {
        Alert.alert('Error', 'Hubo un problema al cargar el perfil del emprendedor.');
      }
    };

    const fetchProductos = async () => {
      try {
        const productosSnapshot = await getDocs(query(collection(db, 'products'), where('emprendedorId', '==', emprendedorId)));
        if (!productosSnapshot.empty) {
          const productosList = productosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setProductos(productosList);
        }
      } catch (error) {
        Alert.alert('Error', 'Hubo un problema al cargar los productos.');
      }
    };

    const loadData = async () => {
      setLoading(true);
      await fetchEmprendedor();
      await fetchProductos();
      setLoading(false);
    };

    loadData();
  }, [emprendedorId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando perfil del emprendedor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {emprendedor ? (
        <>
          <Text style={styles.title}>Perfil del Emprendedor</Text>
          <Text>Nombre del Emprendimiento: {emprendedor.businessName}</Text>
          <Text>Descripción: {emprendedor.businessDescription}</Text>

          <Text style={styles.subtitle}>Productos</Text>
          {productos.length > 0 ? (
            <FlatList
              data={productos}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.product}>
                  <Text>Nombre: {item.nombre}</Text>
                  <Text>Descripción: {item.descripcion}</Text>
                  <Text>Precio: {item.precio}</Text>
                </View>
              )}
            />
          ) : (
            <Text>No hay productos publicados</Text>
          )}
        </>
      ) : (
        <Text>No se encontró información del emprendedor.</Text>
      )}
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  product: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PerfilEmprendedor;
