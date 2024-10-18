import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type EmprendimientosNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Emprendimientos'>;

interface Emprendedor {
  id: string;
  businessName?: string;
  businessDescription?: string;
}

const Emprendimientos: React.FC = () => {
  const [emprendedores, setEmprendedores] = useState<Emprendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<EmprendimientosNavigationProp>();

  // Función para obtener todos los emprendedores desde Firestore
  useEffect(() => {
    const fetchEmprendedores = async () => {
      try {
        const q = query(collection(db, 'users'), where('userType', '==', 'Emprendedor'));
        const querySnapshot = await getDocs(q);
        const emprendedoresList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Emprendedor[];
        setEmprendedores(emprendedoresList);
      } catch (error) {
        console.error('Error al obtener emprendedores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmprendedores();
  }, []);

  // Renderiza la lista de emprendedores
  const renderItem = ({ item }: { item: Emprendedor }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('PerfilEmprendedor', { emprendedorId: item.id })} // Navegar al perfil del emprendedor
    >
      <Text style={styles.emprendedorName}>{item.businessName || 'Emprendedor sin nombre de negocio'}</Text>
      <Text>{item.businessDescription || 'Descripción no disponible'}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando emprendedores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {emprendedores.length > 0 ? (
        <FlatList
          data={emprendedores}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>No se encontraron emprendedores.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  emprendedorName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Emprendimientos;
