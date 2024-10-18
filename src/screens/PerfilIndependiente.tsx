import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useUserContext } from '../context/UserContext';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { RouteProp } from '@react-navigation/native';

type PerfilIndependienteRouteProp = RouteProp<RootStackParamList, 'PerfilIndependiente'>;
type PerfilIndependienteNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PerfilIndependiente'>;

interface Props {
  route: PerfilIndependienteRouteProp;
  navigation: PerfilIndependienteNavigationProp;
}

const PerfilIndependiente: React.FC<Props> = ({ route, navigation }) => {
  const { independienteId } = route.params;
  const { user } = useUserContext();
  const [independienteData, setIndependienteData] = useState<any>(null);
  const [servicios, setServicios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIndependienteData = async () => {
      try {
        const independienteRef = doc(db, 'users', independienteId);
        const independienteSnap = await getDoc(independienteRef);
        if (independienteSnap.exists()) {
          setIndependienteData(independienteSnap.data());
        } else {
          Alert.alert('Error', 'No se encontró el perfil del independiente.');
        }

        const serviciosSnapshot = await getDocs(
          query(collection(db, 'services'), where('independienteId', '==', independienteId))
        );
        const serviciosList = serviciosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServicios(serviciosList);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        Alert.alert('Error', 'Hubo un problema al cargar la información del independiente.');
      } finally {
        setLoading(false);
      }
    };

    fetchIndependienteData();
  }, [independienteId]);

  const handleEliminarServicio = async (servicioId: string) => {
    const password = prompt('Ingresa tu contraseña para confirmar la eliminación del servicio');
    
    if (!password || !auth.currentUser || !auth.currentUser.email) {
      Alert.alert('Error', 'No se pudo verificar la cuenta.');
      return;
    }
  
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteDoc(doc(db, 'services', servicioId));
      Alert.alert('Eliminado', 'El servicio ha sido eliminado exitosamente.');
      setServicios(servicios.filter(servicio => servicio.id !== servicioId));
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar el servicio.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando perfil del independiente...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {independienteData ? (
        <>
          <Text style={styles.title}>Perfil del Independiente</Text>
          <Text>Nombre: {independienteData.name} {independienteData.lastName}</Text>
          <Text>Labor: {independienteData.labor}</Text>

          <Text style={styles.subtitle}>Servicios</Text>
          <FlatList
            data={servicios}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.servicioContainer}>
                <Text>Nombre: {item.nombre}</Text>
                <Text>Descripción: {item.descripcion}</Text>
                <Text>Precio: {item.precio}</Text>
                {user?.uid === independienteId && (
                  <Button title="Eliminar Servicio" onPress={() => handleEliminarServicio(item.id)} />
                )}
              </View>
            )}
            ListEmptyComponent={<Text>No hay servicios publicados.</Text>}
          />
        </>
      ) : (
        <Text>No se encontró el perfil del independiente.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  servicioContainer: {
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

export default PerfilIndependiente;
