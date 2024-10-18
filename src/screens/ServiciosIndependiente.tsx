import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUserContext } from '../context/UserContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
}

const ServiciosIndependiente: React.FC = () => {
  const { user } = useUserContext();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'EditarServicio'>>();

  useEffect(() => {
    const fetchServicios = async () => {
      if (user?.uid) {
        const q = query(collection(db, 'services'), where('independienteId', '==', user.uid));
        const serviciosSnapshot = await getDocs(q);
        const serviciosList: Servicio[] = [];
        serviciosSnapshot.forEach((doc) => {
          const data = doc.data();
          serviciosList.push({ id: doc.id, ...data } as Servicio);
        });
        setServicios(serviciosList);
      }
    };

    fetchServicios();
  }, [user]);

  const handleDeleteServicio = async (servicioId: string) => {
    Alert.alert('Confirmación', '¿Estás seguro de que deseas eliminar este servicio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'services', servicioId));
            Alert.alert('Servicio eliminado', 'El servicio ha sido eliminado exitosamente.');
            setServicios(servicios.filter((servicio) => servicio.id !== servicioId));
          } catch (error) {
            Alert.alert('Error', 'Hubo un problema al eliminar el servicio.');
          }
        },
      },
    ]);
  };

  const renderServicio = ({ item }: { item: Servicio }) => (
    <View style={styles.servicioContainer}>
      <Text>Nombre: {item.nombre}</Text>
      <Text>Descripción: {item.descripcion}</Text>
      <Text>Precio: {item.precio}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('EditarServicio', { servicioId: item.id })}>
          <Icon name="pencil" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteServicio(item.id)}>
          <Icon name="trash" size={30} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={servicios}
        renderItem={renderServicio}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No hay servicios publicados</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  servicioContainer: {
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

export default ServiciosIndependiente;
